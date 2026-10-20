import { defineEventHandler } from 'h3';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function toSlug(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
}

export default defineEventHandler(async (event) => {
    try {
        const response = await fetch('https://api.cinelove.me/api/resources/all');
        if (!response.ok) throw new Error(`API failed: ${response.statusText}`);
        
        const data = await response.json();
        
        const validCategories = (data.categories || []).filter((c: any) => c.id && c.name);
        
        // Cập nhật file JSON để seeder có thể đọc được
        const dataDir = path.join(process.cwd(), 'seeders', 'data');
        await mkdir(dataDir, { recursive: true });
        
        const typesToSeed = validCategories.map((c: any) => ({
             ...c,
             slug: toSlug(c.name)
        }));

        await writeFile(
            path.join(dataDir, 'cinelove-categories.json'), 
            JSON.stringify(typesToSeed, null, 2), 
            'utf-8'
        );

        return {
            success: true,
            categories: typesToSeed
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
});
