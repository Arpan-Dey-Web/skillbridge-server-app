import { prisma } from "../../../lib/prisma";


const createCategory = async (name: string) => {
    return await prisma.category.create({
        data: { name: name.trim() },
    });
};

const getAllCategories = async () => {
    const result = await prisma.category.findMany({
        select: {
            id: true,
            name: true, // Only send what the frontend needs
        },
    });
    return result;
};




export const categorieService = {
    createCategory,
    getAllCategories
}