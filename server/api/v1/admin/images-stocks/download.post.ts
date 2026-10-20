import { defineEventHandler, readBody } from 'h3';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// URL máy chủ chứa hình ảnh (nếu https://api.cinelove.me trả về 404, bạn có thể chỉnh lại CDN ở đây)
const CDN_BASE = "https://assets.cinelove.me/";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, fileKey } = body;

    if (!id || !fileKey) {
        return { success: false, message: "Missing id or fileKey" };
    }

    // Lấy phần mở rộng của background (ví dụ .jpg, .png)
    const ext = fileKey.split('.').pop() || 'jpg';
    
    // Đường dẫn gốc theo API
    const backgroundUrl = `${CDN_BASE}${fileKey}`;
    // Lấy thư mục mẹ trên path (ví dụ resources/background) để cắm vào thumbnail path
    const parts = fileKey.split('/');
    const thumbnailUrl = `${CDN_BASE}${parts.slice(0, -1).join('/')}/thumbnail/${id}.webp`;

    // Thư mục lưu trữ: /public/backgrounds/list và /public/backgrounds/thumbnails
    const backgroundsDir = path.join(process.cwd(), 'public', 'backgrounds', 'list');
    const thumbnailsDir = path.join(process.cwd(), 'public', 'backgrounds', 'thumbnails');
    
    await mkdir(backgroundsDir, { recursive: true });
    await mkdir(thumbnailsDir, { recursive: true });

    const backgroundFile = path.join(backgroundsDir, `${id}.${ext}`);
    const thumbnailFile = path.join(thumbnailsDir, `${id}.webp`);

    try {
        // Tải Background gốc
        const bgRes = await fetch(backgroundUrl);
        if (!bgRes.ok) throw new Error(`Background request failed (${bgRes.status}): ${backgroundUrl}`);
        const bgBuffer = Buffer.from(await bgRes.arrayBuffer());
        await writeFile(backgroundFile, bgBuffer);

        // Tải Thumbnail
        const thumbRes = await fetch(thumbnailUrl);
        if (!thumbRes.ok) throw new Error(`Thumbnail request failed (${thumbRes.status}): ${thumbnailUrl}`);
        const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());
        await writeFile(thumbnailFile, thumbBuffer);

        return { success: true, message: `Successfully downloaded image ID: ${id}` };
    } catch (err: any) {
        return { success: false, message: err.message };
    }
});
