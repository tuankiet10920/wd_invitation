import { defineEventHandler, createError } from 'h3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const db = (global as any).__db;
    const id = event.context.params?.id;

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
    }

    try {
        const qrBox = await (db as any).QrBox.findByPk(id);
        if (!qrBox) {
            return { success: false, message: 'Node not found' };
        }

        // Delete Image
        if (qrBox.image) {
            const filePath = path.resolve('public/images/qr_codes', qrBox.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await qrBox.destroy();

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
});
