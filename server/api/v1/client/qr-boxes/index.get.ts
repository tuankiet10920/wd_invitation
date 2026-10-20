import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const db = (global as any).__db;
    const query = getQuery(event);
    const id_wedding_card = query.id_wedding_card;

    if (!id_wedding_card) {
        return {
            success: false,
            message: 'Missing id_wedding_card'
        };
    }

    try {
        const qrBoxes = await (db as any).QrBox.findAll({
            where: { id_wedding_card: Number(id_wedding_card) }
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
