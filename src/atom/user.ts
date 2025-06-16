import { User } from "@prisma/client";
import {atom} from "jotai";

//ユーザー情報

export const userAtom = atom<User>()