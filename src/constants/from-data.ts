import { SigninFormData, SignupFormData } from "@/types/auth";

export const SIGNUP_FROM_FIELDS: readonly SignupFormData[] = [
    {
      text: "ユーザー名",
      type: "text",
      id: "username",
      placeholder: "ユーザー名を入力してください",
      fieldName: "username",
    },
    {
      text: "メールアドレス",
      type: "email",
      id: "email",
      placeholder: "メールアドレスを入力してください",
      fieldName: "email",
    },
    {
      text: "パスワード",
      type: "password",
      id: "password",
      placeholder: "パスワードを入力してください",
      fieldName: "password",
    },
    {
      text: "確認用パスワード",
      type: "password",
      id: "confirmPassword",
      placeholder: "確認用パスワードを入力してください",
      fieldName: "confirmPassword",
    },
  ] as const;

  export const SIGNIN_FORM_FIELDS: readonly SigninFormData[] = [
    {
        text: "メールアドレス",
        type: "email",
        id: "email",
        placeholder: "メールアドレスを入力してください",
        fieldName: "email",
      },
      {
        text: "パスワード",
        type: "password",
        id: "password",
        placeholder: "パスワードを入力してください",
        fieldName: "password",
      },
  ]