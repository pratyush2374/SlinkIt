import { Router } from "express";
import { createLink, redirectLink, getUserLinks} from "../controllers/link.controllers";
import verifyJwt from "@/middlewares/verifyJwt.middleware";

const linkRouter = Router();

linkRouter.get("/redirect", redirectLink);
linkRouter.post("/create", createLink);
linkRouter.get("/get-user-links", verifyJwt, getUserLinks);
export default linkRouter;
