"use server";

import prisma from "@/utils/prisma/client";
import { User } from "@prisma/client";

export const createUser = async (data: User) => {
    try {

        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        })

        if(existingUser) {
            return {
                success: false,
                message: "このメールアドレスは既に登録されています"
            }
        }

        const result = await prisma.user.create({
            data: {
                id: data.id,
                email: data.email,
                username: data.username,
            }
        })

        if(!result) {
            return {
                success: false,
                message: "ユーザーの作成に失敗しました"
            }
        }

        return {
            success: true,
            message: "ユーザーの作成が完了しました",
            user: result,
        }
    } catch(error) {
        console.error("Error during user creation:", error);
        return {
            success: false,
            message: "ユーザーの作成に失敗しました",
        };
    }
}