import { z } from "zod";

export const SignupSchema = z
  .object({
    username: z
      .string()
      .min(2, "ユーザー名は必須です")
      .max(15, "ユーザー名は15文字以内で入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(20, "パスワードは20文字以内で入力してください"),
    confirmPassword: z
      .string()
      .min(8, "確認用パスワードは8文字以上で入力してください")
      .max(20, "確認用パスワードは20文字以内で入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードと確認用パスワードが一致しません",
    path: ["confirmPassword"],
  });

  export const SigninSchema = z.object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(20, "パスワードは20文字以内で入力してください"),
  })