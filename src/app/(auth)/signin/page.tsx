"use client";

import { signinUser } from "@/actions/auth/signinUser";
import { userAtom } from "@/atom/user";
import AuthInput from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SIGNIN_FORM_FIELDS } from "@/constants/from-data";
import { signin } from "@/lib/supabase/authRepository";
import { SigninSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SigninPage = () => {

  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  type SigninForm = z.infer<typeof SigninSchema>;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedValues = watch();
  const isFormDisabled = () => {
    return !watchedValues.email || !watchedValues.password;
  };

  const handleSignin = async(data: SigninForm) => {
    console.log(data)
    try {
      const authResult = await signin(data.email, data.password);
      if(authResult && !authResult.success) {
        console.error(authResult.message);
        return
      }

      if(!authResult || !authResult.data) {
        console.error(authResult?.message || "サインインに失敗しました");
        return {
          success: false,
          message: authResult?.message || "サインインに失敗しました",
        }
      }


     const prismaResult = await signinUser(authResult?.data.user.id);

      if (!prismaResult.success || !prismaResult.user) {
        console.error("User signin failed:", prismaResult.message);
        return;
      }

      // 認証成功
      setUser(prismaResult.user);
      router.replace("/");
      console.log("Signed in user:", prismaResult.user);



    } catch(error) {
      console.error("Signin error:", error);
    }
  }

  return (
    <Card className="w-[90%] max-h-[70%] p-5">
      <form onSubmit={handleSubmit(handleSignin)} className="flex flex-col gap-6">
        {SIGNIN_FORM_FIELDS.map((item) => {
          const { text, id, placeholder, type, fieldName } = item;
          return (
            <AuthInput<SigninForm>
              key={fieldName}
              text={text}
              id={id}
              placeholder={placeholder}
              fieldName={fieldName}
              type={type}
              error={errors[fieldName]?.message as string}
              register={register}
            />
          );
        })}
        <Button
          type="submit"
          variant={"default"}
          disabled={isFormDisabled()}
          className="bg-green-400 hover:bg-green-400/80 disabled:bg-gray-400"
        >
          ログイン
        </Button>
      </form>
    </Card>
  );
};

export default SigninPage;
