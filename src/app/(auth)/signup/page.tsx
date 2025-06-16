"use client";

import { createUser } from "@/actions/auth/createuser";
import AuthInput from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SIGNUP_FROM_FIELDS } from "@/constants/from-data";
import { signup } from "@/lib/supabase/authRepository";
import { SignupSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SignupFormData = z.infer<typeof SignupSchema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedValues = watch();

  const isFormDisabled = () => {
    return (
      !watchedValues.username ||
      !watchedValues.email ||
      !watchedValues.password ||
      !watchedValues.confirmPassword ||
      !isValid || // バリデーションエラーがある場合も無効化
      isSubmitting // 送信中も無効化
    );
  };

  const signupData = async(data: SignupFormData) => {
    try {
      const authResult = await signup(data.email, data.password);
      if(authResult && !authResult?.success) {
        console.error("Signup failed:", authResult.message);
        return {
          success: false,
          message: authResult.message || "登録に失敗しました"
        }
      }

      if(!authResult?.data?.user) {
        console.error("User data is missing in signup response");
        return {
          success: false,
          message: "ユーザー情報の取得に失敗しました"
        }
      }

      const userId = authResult?.data?.user.id

      const prismaResult = await createUser({
        id: userId,
        email: data.email,
        username: data.username
      })

      if(!prismaResult?.success) {
        console.error("User creation failed:", prismaResult.message);
        return {
          success: false,
          message: prismaResult.message || "ユーザー情報の作成に失敗しました"
        }
      }

      return {
        success: true,
        message: "登録が完了しました",
        data: {
          user: prismaResult.user,
        }
      }

    } catch(error) {
      console.error("Error during signup:", error);
    }

  };

  return (
    <Card className="w-[90%] max-h-[70%] p-5">
      <form onSubmit={handleSubmit(signupData)} className="flex flex-col gap-6">
        {SIGNUP_FROM_FIELDS.map((item) => (
          <AuthInput
            key={item.fieldName}
            text={item.text}
            id={item.id}
            placeholder={item.placeholder}
            type={item.type}
            register={register}
            fieldName={item.fieldName}
            error={errors[item.fieldName]?.message as string}
          />
        ))}

        <Button
          disabled={isFormDisabled()}
          className="font-bold text-black bg-green-300 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-green-200"
        >
          {isSubmitting ? "登録中..." : "新規登録する"}
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-600">既にアカウントをお持ちですか？</p>
        <Button variant={"link"} asChild>
          <Link href={"/signin"} className="text-blue-600">
            ログインはこちら
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default SignupPage;
