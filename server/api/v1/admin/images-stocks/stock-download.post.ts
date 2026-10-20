import { defineEventHandler, readBody } from 'h3';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CDN_BASE = "https://assets.cinelove.me/";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, fileKey, categorySlug, categoryType, index } = body;

    if (!id || !fileKey || !categorySlug) {
        return { success: false, message: "Missing id, fileKey or categorySlug" };
    }

    const isSvg = categoryType === 'svg';
    const ext = fileKey.split('.').pop() || (isSvg ? 'svg' : 'png');
    const thumbExt = isSvg ? 'svg' : 'webp';
    
    // Background list full url
    const listUrl = `${CDN_BASE}${fileKey}`;
    // Thumbnail url (tự động nội suy đường dẫn từ fileKey để hỗ trợ tất cả category thay vì chỉ "characters")
    const parts = fileKey.split('/');
    const thumbnailUrl = `${CDN_BASE}${parts.slice(0, -1).join('/')}/thumbnail/${id}.${thumbExt}`;

    const listsDir = path.join(process.cwd(), 'public', 'images', 'stocks', 'lists');
    const thumbnailsDir = path.join(process.cwd(), 'public', 'images', 'stocks', 'thumbnails');
    
    await mkdir(listsDir, { recursive: true });
    await mkdir(thumbnailsDir, { recursive: true });

    // Format: <slug><stt ví dụ 1,2,3...>.<ext>
    const listFile = path.join(listsDir, `${categorySlug}${index}.${ext}`);
    const thumbnailFile = path.join(thumbnailsDir, `${categorySlug}${index}.${thumbExt}`);

    try {
        // Tải List
        const listRes = await fetch(listUrl);
        if (!listRes.ok) throw new Error(`List Request failed (${listRes.status}): ${listUrl}`);
        const listBuffer = Buffer.from(await listRes.arrayBuffer());
        await writeFile(listFile, listBuffer);

        // Tải Thumbnail (Nếu là SVG thì bỏ qua luôn phần Thumbnail)
        if (!isSvg) {
            const thumbRes = await fetch(thumbnailUrl);
            if (!thumbRes.ok) throw new Error(`Thumbnail Request failed (${thumbRes.status}): ${thumbnailUrl}`);
            const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());
            await writeFile(thumbnailFile, thumbBuffer);
        }

        return { success: true, message: `Successfully downloaded ${categorySlug}${index}` };
    } catch (err: any) {
        return { success: false, message: err.message };
    }
});
