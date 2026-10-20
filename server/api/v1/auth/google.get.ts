import { AuthService } from "~~/server/services/AuthService";
import { useRuntimeConfig } from "#imports";

const Auth = new AuthService();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  console.log(
    "[Google Handler] Current Config ClientID:",
    config.oauth.google.clientId?.substring(0, 10) + "...",
  );

  return defineOAuthGoogleEventHandler({
    config: {
      authorizationParams: {
        prompt: "select_account",
      },
    },
    async onSuccess(event, { user }) {
      await Auth.authSession(event, {
        image: user.picture,
        name: user.name,
        social: "google",
        attributes: {
          email: user.email,
        },
      });

      return sendRedirect(event, "/dashboard");
    },
  })(event);
});
