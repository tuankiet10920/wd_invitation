import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const db = (global as any).__db;
    const slug = event.context.params?.slug;

    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing slug'
        });
    }

    try {
        // 1. Find the wedding card by slug (from url column)
        const card = await (db as any).WeddingCard.findOne({
            where: { url: slug }
        });

        if (!card) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Wedding card not found'
            });
        }

        // 2. Fetch QR boxes for this card
        const qrBoxes = await (db as any).QrBox.findAll({
            where: { id_wedding_card: card.id }
        });

        return {
            success: true,
            data: qrBoxes
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
});
