"use client";

import { signinUser } from "@/actions/auth/signinUser";
import { userAtom } from "@/atom/user";
import { getuser } from "@/lib/supabase/authRepository";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AuthGuradProps {
  children: ReactNode;
  redirectTo?: string;
}

const AuthGurad = ({ children, redirectTo = "/signin" }: AuthGuradProps) => {
  const [user,setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        if(user) {
            setIsAuthenticated(true);
            setIsLoading(false);
            console.log(user)
            return;
        }

        // supabaseからユーザー情報を取得
        const authResult = await getuser();
        if (!authResult || !authResult.success || !authResult.user) {
          console.error(
            "User retrieval failed:",
            authResult?.message || "Unknown error"
          );
          setIsAuthenticated(false);
          router.push(redirectTo);
          return;
        }

        // prismaからユーザー情報を取得
        const prismaResult = await signinUser(authResult.user.id);

        if (!prismaResult.success || !prismaResult.user) {
          console.error("User signin failed:", prismaResult.message);
          setIsAuthenticated(false);
          router.push(redirectTo);
        }

        //認証成功
        setUser(prismaResult.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser, router, redirectTo]);

  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null
};

export default AuthGurad;
