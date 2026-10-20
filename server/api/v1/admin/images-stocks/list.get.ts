import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const response = await fetch('https://api.cinelove.me/api/resources/categories/background');
        if (!response.ok) {
            throw new Error(`External API failed: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
});
