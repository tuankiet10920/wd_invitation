export default defineEventHandler(async (event) => {
  const path = event.path;
  const isGoogle = path.includes("/auth/google");
  const isFacebook = path.includes("/auth/facebook");

  if (!isGoogle && !isFacebook) return;

  try {
    const SettingModel = global.__db.Setting;
    if (!SettingModel) return;

    const config = useRuntimeConfig(event);

    if (isGoogle) {
      const [clientIdDoc, secretIdDoc] = await Promise.all([
        SettingModel.findOne({
          where: { key: "google_client_id" },
          raw: true,
        }),
        SettingModel.findOne({
          where: { key: "google_client_secret" },
          raw: true,
        }),
      ]);

      if (clientIdDoc && secretIdDoc) {
        // Ghi đè trực tiếp vào thuộc tính của object config hiện tại
        console.log(`[Middleware] Updating Google Config: ${clientIdDoc.value.substring(0, 10)}...`);
        Object.assign(config.oauth.google, {
          clientId: clientIdDoc.value,
          clientSecret: secretIdDoc.value,
          redirectURL: ``,
        });
      }
    }

    if (isFacebook) {
      const [clientIdDoc, secretIdDoc] = await Promise.all([
        SettingModel.findOne({
          where: { key: "facebook_client_id" },
          raw: true,
        }),
        SettingModel.findOne({
          where: { key: "facebook_client_secret" },
          raw: true,
        }),
      ]);

      if (clientIdDoc && secretIdDoc) {
        // Ghi đè config oauth cho facebook
        // Lưu ý: Cấu trúc config của facebook plugin cũ hơi khác (spread config.oauth), 
        // nhưng về cơ bản ta cần đảm bảo config.oauth.facebook tồn tại và có giá trị mới.
        config.oauth = {
          ...config.oauth,
          facebook: {
            clientId: clientIdDoc.value,
            clientSecret: secretIdDoc.value,
            redirectURL: "",
          },
        };
        // console.log("✅ [Middleware] Loaded Facebook Auth Config");
      }
    }
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
  }
});
