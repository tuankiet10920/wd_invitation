import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "../data/user";
import { VerifyTokenData } from "../data/verify-token";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { setCookie } from "h3";
import { v7 as uuidv7 } from "uuid";
import { useRuntimeConfig } from "#imports";
import { ValidateService } from "./ValidateServices";
import { Role, BodyDataSession } from "~~/interfaces";
import JobService from "./JobServices";

interface ConfigCookieInterface {
  httpOnly: boolean;
  path: string;
  maxAge?: number;
  sameSite: "none" | "lax" | "strict";
  secure: boolean;
}

const User = new UserData();
const Validate = new ValidateService();

const SALT = "-pas-";

type Social = "facebook" | "google";

interface Attributes {
  email?: string;
  facebookUserId?: string;
}

interface BodySession {
  name: string;
  image: string;
  remember?: boolean;
  social?: Social;
  attributes: Attributes;
}

export class AuthService {
  public async login(event: any) {
    const body = await readBody(event);
    const { email, password, remember } = body;
    const config = useRuntimeConfig();
    try {
      const user = await User.checkUserNormal(email);

      // nếu không tồn tại user
      if (!user) return FormatResponse.error(event, "Email is not exists!");

      if (user.is_google)
        return FormatResponse.error(
          event,
          "Your account has been signed in with google account!",
        );

      // nếu tồn tại user
      // kiểm tra password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return FormatResponse.error(event, "Wrong email or password!");

      let dataResponse;

      if (Object.prototype.hasOwnProperty.call(body, "isAdmin")) {
        if (user.role != "admin")
          return FormatResponse.error(event, "Permission denied!");

        const token = jwt.sign({ id: user.id }, config.jwtSecret, {
          expiresIn: Number(config.lifetimeCookieAdmin),
        });

        const body = {
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: "admin" as Role,
        };

        dataResponse = body;

        await this.sendAdminSession(event, token, body);
      } else {
        if (user.role == "admin")
          return FormatResponse.error(event, "Permission denied!");

        const data: BodyDataSession = {
          email: user.email,
          image: user.avatar,
          name: user.name,
          remember,
          role: "user",
        };

        dataResponse = data;

        await this.sendUserSession(event, data);
      }

      return FormatResponse.success(dataResponse, "Auth successfully!");
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }

  public async register(event: any) {
    const templateId = "active-account-cinelove";
    try {
      const body = await readBody(event);

      const { name, email, password } = body;

      const isFillIn = Validate.checkExists(
        ["email", "name", "password"],
        body,
      );
      if (Array.isArray(isFillIn))
        return FormatResponse.error(
          event,
          `Fill in all the information please! (${isFillIn.join(", ")})`,
        );

      const isExist = await User.checkUserNormal(email);

      if (isExist)
        return FormatResponse.error(
          event,
          "This email account is already exists!",
        );

      // tạo mới user nếu chưa tồn tại
      const user = await User.create(email, password, name);

      // create token verify
      const token = uuidv7();
      const VerifyToken = new VerifyTokenData();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const createdToken = await VerifyToken.create(
        token,
        user.id,
        "VERIFY_ACCOUNT",
        expires,
      );

      const config = useRuntimeConfig();
      const link = `${
        config.environment == "production" || config.environment == "test"
          ? config.public.siteUrl
          : config.public.urlLocalHost
      }/api/v1/auth/activate?email=${email}&token=${token}`;

      const params = {
        name: email.split("@")[0] || user.name,
        link,
      };

      if (createdToken) {
        const Job = new JobService();
        await Job.email("email-tasks", {
          fromName: "Thiệp Cưới",
          isTemplate: true,
          subject: "Verify Your Email",
          templateId,
          to: email,
          tags: [{ name: "account", value: "verify-email" }],
          params,
        });
      }

      return FormatResponse.success({ email, name }, "Register successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  protected sendResponseWithCookie(
    event: any,
    { payload = {}, remember = false, data = {} } = {},
  ) {
    const config = useRuntimeConfig();

    const signOptions: SignOptions = {
      expiresIn: (config.public.jwtExpired || "30d") as any,
    };

    const secretKey: Secret = config.jwtSecret || "fallback_secret_key";

    const token = jwt.sign(payload, secretKey, signOptions);

    const configToken: ConfigCookieInterface = {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: config.environment == "production",
      maxAge: 60 * 60 * 24 * 30, // tạm thời, sau sẽ dùng logic remember
    };

    if (remember) configToken.maxAge = 60 * 60 * 24 * 30;

    // trả về response kèm token
    setCookie(event, "PA_TOKEN", token, configToken);

    return FormatResponse.success(data);
  }

  async verifyEmail(event: any) {
    const query = getQuery(event);

    if (!query.email) return FormatResponse.error(event, "Email is required!");
    if (!query.token) return FormatResponse.error(event, "Token is required!");

    const { email, token } = query;
    const VerifyToken = new VerifyTokenData();

    try {
      const user = await User.checkUserNormal(email as string);

      if (!user) return FormatResponse.error(event, "User is not exists!");

      if (user.is_active)
        return send(
          event,
          this.getHtmlResponse(
            false,
            "Tài khoản của bạn đã xác thực trước đó!",
          ),
        );

      const _token = await VerifyToken.verify(
        token as string,
        user.id,
        "VERIFY_ACCOUNT",
      );

      if (!_token) return FormatResponse.error(event, "Your token is invalid!");

      const now = new Date();
      if (_token.expires_at < now)
        return FormatResponse.error(event, "Your token is expired!");

      user.is_active = true;
      user.social = "normal";
      user.verify_at = new Date();
      await user.save();

      return send(
        event,
        this.getHtmlResponse(true, "Xác thực tài khoản thành công!"),
      );
    } catch (error: any) {
      return send(
        event,
        this.getHtmlResponse(false, "Xác thực tài khoản thất bại!"),
      );
    }
  }

  private getHtmlResponse(success: boolean, message: string) {
    const title = success ? "Thành công" : "Thất bại";
    const color = success ? "#22c55e" : "#ef4444";
    const bgColor = success ? "#dcfce7" : "#fee2e2";
    const iconFn = success
      ? `<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />`
      : `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`;

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background-color: #f3f4f6;
              }
              .container {
                  background-color: white;
                  padding: 2.5rem;
                  border-radius: 1rem;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  max-width: 28rem;
                  width: 90%;
              }
              .icon-wrapper {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 4rem;
                  height: 4rem;
                  border-radius: 50%;
                  background-color: ${bgColor};
                  margin-bottom: 1.5rem;
              }
              .icon {
                  width: 2rem;
                  height: 2rem;
                  color: ${color};
              }
              h1 {
                  color: #111827;
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin: 0 0 0.5rem 0;
              }
              p {
                  color: #4b5563;
                  margin-bottom: 2rem;
                  line-height: 1.5;
              }
              .footer {
                  border-top: 1px solid #e5e7eb;
                  padding-top: 1rem;
                  font-size: 0.875rem;
                  color: #6b7280;
              }
              #countdown {
                  font-weight: 600;
                  color: #374151;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                      ${iconFn}
                  </svg>
              </div>
              <h1>${title}</h1>
              <p>${message}</p>
              <div class="footer">
                  Trang sẽ tự động đóng sau <span id="countdown">5</span> giây
              </div>
          </div>
          <script>
              let seconds = 5;
              const el = document.getElementById('countdown');
              const interval = setInterval(() => {
                  seconds--;
                  if (el) el.textContent = seconds;
                  if (seconds <= 0) {
                      clearInterval(interval);
                      window.close();
                  }
              }, 1000);
          </script>
      </body>
      </html>
    `;
  }
  async authSession(event: any, body: BodySession) {
    const remember = getCookie(event, "remember") == "true" ? true : false;
    const { image, name, social, attributes } = body;
    try {
      const existUser =
        social == "google"
          ? await User.checkUserNormal(attributes.email as string)
          : await User.checkUserFacebook(attributes.facebookUserId as string);

      if (!existUser)
        await User.createWithSocial(
          image,
          name,
          social as Social,
          social == "google"
            ? { email: attributes.email }
            : { facebookUserId: attributes.facebookUserId },
        );

      const role: Role = "user";

      const data: BodyDataSession = {
        name: body.name,
        image: body.image,
        ...(social == "google" && { email: attributes.email }),
        role,
        remember,
      };

      await this.sendUserSession(event, data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  async sendUserSession(event: any, body: BodyDataSession) {
    const config = useRuntimeConfig();
    try {
      return await setUserSession(
        event,
        {
          user: body,
        },
        {
          maxAge: body.remember ? Number(config.lifetimeCookie) : undefined,
        },
      );
    } catch (error) {
      throw new Error("Error while sending user session: " + error);
    }
  }
  async sendAdminSession(
    event: any,
    token: string,
    body: { name: string; email: string },
  ) {
    const config = useRuntimeConfig();
    try {
      setCookie(event, "auth_admin_token", token, {
        httpOnly: true,
        secure: config.environment == "production" ? true : false,
        sameSite: "strict",
        maxAge: Number(config.lifetimeCookieAdmin),
        path: "/",
      });

      setCookie(event, "auth_admin_info", JSON.stringify(body), {
        httpOnly: false,
        secure: config.environment == "production" ? true : false,
        sameSite: "strict",
        maxAge: Number(config.lifetimeCookieAdmin),
        path: "/",
      });
      return true;
    } catch (error) {
      throw new Error("Error while sending user session: " + error);
    }
  }

  async sendMailResetPassword(event: any) {
    const body = await readBody(event);
    const Job = new JobService();
    const { email } = body;
    try {
      const user = await User.checkUserNormal(email);

      if (!user) return FormatResponse.error(event, "Account doesn't exist!");

      // create new token
      const token = uuidv7();
      const VerifyToken = new VerifyTokenData();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const createdToken = await VerifyToken.create(
        token,
        user.id,
        "RESET_PASSWORD",
        expires,
      );

      if (createdToken) console.log("Token created successfully!");

      const config = useRuntimeConfig();

      await Job.email("email-tasks", {
        fromName: "Thiệp Cưới",
        isTemplate: true,
        subject: "Reset Password",
        templateId: "reset-password-cinelove",
        to: email,
        tags: [{ name: "email", value: "reset-password" }],
        params: {
          name: email.split("@")[0] ?? "Unnamed",
          link: `${
            config.environment == "production" || config.environment == "test"
              ? config.public.siteUrl
              : config.public.urlLocalHost
          }/reset-password/${token + SALT + email}`, // đổi lại đường link giao diện // api sẽ được gọi trong component của giao diện
        },
      });

      return FormatResponse.success(
        {
          email,
        },
        "Send mail reset password successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  async verifyResetPassword(event: any) {
    const token = getRouterParam(event, "token");

    // verify correct pattern token

    const validate = await this.validateTokenResetPassword(token as string);
    if ("status" in validate)
      return FormatResponse.error(event, validate.message);

    try {
      const { token, user } = validate;
      return FormatResponse.success(
        token + SALT + user.email,
        "Received token, token is valid!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  private async validateTokenResetPassword(token: string) {
    if (!token?.includes(SALT))
      return this.resultValidate(false, "Token is incorrect!");

    const arrToken = token.split(SALT);
    const _token = arrToken[0];
    const email = arrToken[1];

    const VerifyToken = new VerifyTokenData();

    try {
      const user = await User.checkUserNormal(email);
      if (!user) return this.resultValidate(false, "User is not exist!");

      const exist = await VerifyToken.verify(_token, user.id, "RESET_PASSWORD");
      if (!exist) return this.resultValidate(false, "Token is not exist!");

      return {
        token: _token,
        user,
      };
    } catch (error) {
      throw new Error("Error while validate token reset password! " + error);
    }
  }

  resultValidate(status: boolean = false, message: string = "") {
    return {
      status,
      message,
    };
  }

  async resetPassword(event: any) {
    const body = await readBody(event);
    const { token } = body;

    // verify correct pattern token

    const validate = await this.validateTokenResetPassword(token as string);
    if ("status" in validate)
      return FormatResponse.error(event, validate.message);

    try {
      const { user } = validate;
      const { password, confirm_password } = body;

      if (password != confirm_password)
        return FormatResponse.error(event, "Password is not same!");

      user.password = password;
      await user.save();

      return FormatResponse.success(
        user.email,
        "Change password successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
