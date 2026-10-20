import { DataPattern } from ".";

type TokenType = "VERIFY_ACCOUNT" | "RESET_PASSWORD";

export class VerifyTokenData extends DataPattern {
  protected table = "VerifyToken";

  async create(
    token: string,
    id_user: string | number,
    type: TokenType,
    expires_at: Date
  ): Promise<any> {
    const VerifyTokenModel = this.getModels()?.VerifyToken;
    try {
      await VerifyTokenModel.create({
        token,
        type,
        id_user,
        expires_at,
      });
      return true;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  async verify(
    token: string,
    id_user: string | number,
    type: TokenType
  ): Promise<any> {
    const VerifyTokenModel = this.getModels()?.VerifyToken;
    try {
      return await VerifyTokenModel.findOne({
        where: {
          token,
          type,
          id_user,
        },
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
