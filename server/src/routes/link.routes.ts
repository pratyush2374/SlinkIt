import { Router } from "express";
import { createLink, redirectLink, getUserLinks, deleteAlias} from "../controllers/link.controllers";
import verifyJwt from "@/middlewares/verifyJwt.middleware";
import addUser from "@/middlewares/addUser.middleware";

const linkRouter = Router();

linkRouter.post("/redirect", redirectLink);
linkRouter.post("/create", addUser, createLink);
linkRouter.get("/get-user-links", verifyJwt, getUserLinks);
linkRouter.delete("/delete-alias", verifyJwt, deleteAlias);
export default linkRouter;
