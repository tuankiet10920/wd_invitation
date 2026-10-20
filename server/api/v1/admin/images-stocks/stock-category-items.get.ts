import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const categoryId = query.id as string;
    
    if (!categoryId) return { success: false, message: 'Missing Category ID' };

    try {
        const response = await fetch(`https://api.cinelove.me/api/resources/categories/${categoryId}`);
        if (!response.ok) throw new Error(`API failed: ${response.statusText}`);
        
        const data = await response.json();
        return {
            success: true,
            items: data.items || []
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
});
