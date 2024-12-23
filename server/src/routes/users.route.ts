import {
  deleteAvatar,
  deleteUser,
  getAllUsers,
  getUser,
  updatePassword,
  updateUser,
  uploadAvatar,
} from "@/controllers/users.controller";
import { authorizeUser, upload, validateResource, verifyJwt } from "@/middlewares";
import { deleteUserSchema, updatePasswordSchema, updateUserSchema } from "@/schemas/user.schema";
import express from "express";

const router = express.Router();

router.use(verifyJwt);

router.get("/profile", getUser);
router.patch("/profile", validateResource(updateUserSchema), updateUser);
router.delete("/profile", validateResource(deleteUserSchema), deleteUser);
router.patch("/password", validateResource(updatePasswordSchema), updatePassword);
router.post("/profile/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/profile/avatar", deleteAvatar);

router.use(authorizeUser("admin"));

router.get("/", getAllUsers);

export default router;
