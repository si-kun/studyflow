//supabase signup

import { createClient } from "@/utils/supabase/client";



export const signup = async (email: string, password: string) => {
  try {

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return {
        success: false,
        message: error.message || "登録に失敗しました",
      };
    }

    if (data.user) {
      return {
        success: true,
        message: "登録が完了しました",
        data: {
            user: data.user,
        }
      };
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      success: false,
      message: "登録に失敗しました",
    };
  }
};

export const signin = async (email: string, password: string) => {
  try {

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error:", error.message);
      return {
        success: false,
        message: error.message || "ログインに失敗しました",
      };
    }

    if (data.session) {
      return {
        success: true,
        message: "ログインに成功しました",
        data: {
            user: data.user,
        }
      };
    }
  } catch (error) {
    console.error("Error during signin:", error);
    return {
      success: false,
      message: "ログインに失敗しました",
    };
  }
};

export const getuser = async () => {
    try {

        const supabase = createClient();

        const { data: {user}, error} = await supabase.auth.getUser();

        if(error) {
            console.error("Get user error:", error.message);
            return {
                success: false,
                message: error.message || "ユーザー情報の取得に失敗しました",
            };
        }

        if(user) {
            return {
                success: true,
                user: {
                    id: user.id,
                }
            }
        }

    } catch(error) {
        console.error("Error getting user:", error);
        return {
            success: false,
            message: "ユーザー情報の取得に失敗しました",
        };
    }
}
