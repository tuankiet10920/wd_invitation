import { DataPattern } from ".";

export class AcceptInvitationData extends DataPattern {
  protected table = "AcceptInvitation";

  public async create(data: any) {
    const AcceptInvitationModel = this.getModels()?.AcceptInvitation;
    return await AcceptInvitationModel.create(data);
  }

  public async listByCard(idWeddingCard: number) {
    const AcceptInvitationModel = this.getModels()?.AcceptInvitation;
    return await AcceptInvitationModel.findAll({
      where: { id_wedding_card: idWeddingCard },
      order: [["createdAt", "DESC"]],
    });
  }

  public async delete(id: number | string) {
    const AcceptInvitationModel = this.getModels()?.AcceptInvitation;
    return await AcceptInvitationModel.destroy({ where: { id } });
  }
}
