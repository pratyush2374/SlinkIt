import {
    sendCode,
    signUp,
    signIn,
    refreshBothTokens,
    signOut
} from "@/controllers/user.controllers";
import verifyJwt from "@/middlewares/verifyJwt.middleware";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/send-code", sendCode);
userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.get("/refresh-tokens", verifyJwt, refreshBothTokens);
userRouter.get("/sign-out", verifyJwt, signOut);

export default userRouter;
