import { AuthService } from "~~/server/services/AuthService";
import { useRuntimeConfig } from "#imports";

const Auth = new AuthService();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log(
    "[Facebook Handler] Current Config ClientID:",
    config.oauth.facebook.clientId?.substring(0, 5) + "...",
  );
  return defineOAuthFacebookEventHandler({
    async onSuccess(event, { user }) {
      console.log("user: ", user);
      const avatarUrl = `https://graph.facebook.com/${user.id}/picture?type=large`;
      await Auth.authSession(event, {
        image: avatarUrl,
        name: user.name,
        social: "facebook",
        attributes: {
          facebookUserId: user.id,
        },
      });
      return sendRedirect(event, "/dashboard");
    },
  })(event);
});
