"use server"

import prisma from "@/utils/prisma/client";

export const  signinUser = async(userId: string) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                knowledges: true,
                categories: true,
                tags: true
            }
        })

        if(!result) {
            return {
                success: false,
                message: "ユーザーが見つかりません"
            }
        }

        return {
            success: true,
            message: "サインインに成功しました",
            user: result,
        }
    } catch(error) {
        console.error("Error during user signin:", error);
        return {
            success: false,
            message: "サインインに失敗しました"
        }
    }
}