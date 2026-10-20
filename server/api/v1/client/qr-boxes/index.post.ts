import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    const db = (global as any).__db;

    const formData = await readMultipartFormData(event);
    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing form data',
        });
    }

    let name = '';
    let name_reveive = '';
    let name_bank = '';
    let number_bank = '';
    let id_wedding_card: number | null = null;
    let fileBuffer: Buffer | null = null;
    let fileName = '';

    for (const field of formData) {
        if (field.name === 'name') name = field.data.toString();
        if (field.name === 'name_reveive') name_reveive = field.data.toString();
        if (field.name === 'name_bank') name_bank = field.data.toString();
        if (field.name === 'number_bank') number_bank = field.data.toString();
        if (field.name === 'id_wedding_card') id_wedding_card = Number(field.data.toString());
        if (field.name === 'image') {
            fileBuffer = field.data;
            const extension = field.filename ? path.extname(field.filename) : '.png';
            fileName = `qr_${uuidv4()}${extension}`;
        }
    }

    if (!id_wedding_card) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing id_wedding_card',
        });
    }

    // Check limit (max 2)
    const count = await (db as any).QrBox.count({
        where: { id_wedding_card }
    });

    if (count >= 2) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bạn chỉ có thể thêm tối đa 2 tài khoản ngân hàng.',
        });
    }

    // Process Image
    if (fileBuffer) {
        const uploadDir = path.resolve('public/images/qr_codes');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, fileName), fileBuffer);
    }

    try {
        const qrBox = await (db as any).QrBox.create({
            name,
            name_reveive,
            name_bank,
            number_bank,
            image: fileName,
            id_wedding_card
        });

        return {
            success: true,
            data: qrBox
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
});
