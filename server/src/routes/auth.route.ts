import { login, logout, refresh, register } from "@/controllers/auth.controller";
import { validateResource, verifyJwt } from "@/middlewares";
import { loginUserSchema, registerUserSchema } from "@/schemas/user.schema";
import express from "express";

const router = express.Router();

router.post("/register", validateResource(registerUserSchema), register);
router.post("/login", validateResource(loginUserSchema), login);
router.get("/refresh", refresh);

router.use(verifyJwt);

router.post("/logout", logout);

export default router;
