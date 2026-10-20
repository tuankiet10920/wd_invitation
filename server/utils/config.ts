export const getOAuthConfig = async (provider: "facebook" | "google") => {
  const SettingModel = global.__db.models.Setting;

  const clientId = await SettingModel.findOne({
    where: { key: `${provider}_client_id` },
    raw: true,
  });

  const secretId = await SettingModel.findOne({
    where: { key: `${provider}_secret_id` },
    raw: true,
  });

  return {
    clientId: clientId?.value || "",
    clientSecret: secretId?.value || "",
  };
};
