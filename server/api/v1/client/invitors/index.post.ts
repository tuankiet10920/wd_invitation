import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const { Invitor: InvitorModel, WeddingCard: WeddingCardModel } = global.__db;
    const body = await readBody(event);
    
    // Determine content JSON string
    if (!body || typeof body !== 'object') {
        return FormatResponse.error(event, "Invalid request body");
    }

    let { invitation, value, isCustom, id_card, slug } = body;
    
    if (slug) {
        const card = await WeddingCardModel.findOne({ where: { url: slug } });
        if (card) {
            id_card = card.id;
        }
    }

    if (invitation === undefined || value === undefined) {
        return FormatResponse.error(event, "Missing required fields: invitation, value");
    }

    const contentObj = {
        invitation,
        value,
        isCustom: !!isCustom
    };

    const newInvitor: any = await InvitorModel.create({
        content: JSON.stringify(contentObj),
        id_card: id_card || null // if not provided
    });

    const newId = Number(newInvitor.id);
    let x = 6;
    if (newId % 2 === 0) {
        x = 1;
    } else if (newId % 5 === 0) {
        x = 2;
    } else if (newId % 7 === 0) {
        x = 3;
    } else if (newId % 9 === 0) {
        x = 4;
    }

    const token = `TK${x}Q${newId + 5}S`;
    newInvitor.token = token;
    await newInvitor.save();

    return FormatResponse.success(newInvitor, "Invitor created successfully");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
