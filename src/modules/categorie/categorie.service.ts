import { prisma } from "../../../lib/prisma";


const createCategory = async (name: string) => {
    return await prisma.category.create({
        data: { name: name.trim() },
    });
};

const updateCategory = async (id: string, name: string) => {
    return await prisma.category.update({
        where: { id },
        data: { name: name.trim() },
    });
};

const deleteCategory = async (id: string) => {
    return await prisma.category.delete({
        where: { id },
    });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: { tutors: true }
            }
        },
    });
};

const getTutorsByCategory = async (
    categoryName: string,
    page: number,
    limit: number
) => {
    const skip = (page - 1) * limit;

    const result = await prisma.category.findUnique({
        where: { name: categoryName },
        include: {
            tutors: {
                where: {
                    user: { status: "ACTIVE" },
                },
                include: {
                    user: {
                        select: { name: true, image: true },
                    },
                    category: true
                },
                take: limit,
                skip: skip,
                orderBy: { averageRating: "desc" },
            },
            _count: {
                select: {
                    tutors: {
                        where: { user: { status: "ACTIVE" } }
                    }
                },
            },
        },

    });
    return result;
}

export const categorieService = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getTutorsByCategory
}