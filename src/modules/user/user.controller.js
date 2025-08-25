import { Router } from "express";
import * as userService from "./user.service.js"
import { uploadfile } from "../../utilies/multer/multer.local.js";
import { uploadfile as uploadfileCloud} from "../../utilies/multer/multer.cloud.js";
import { fileValidation } from "../../middleware/file-validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();
router.delete("/", isAuthenticated, userService.deleteUser);
// router.post("/upload-profile-picture",isAuthenticated,uploadfile({folder:"profilePicture" ,allowedType:["image/png" ,"image/jpeg"]}).single("profilePicture") , fileValidation(),userRouter.uploadProfilePicture);
router.post("/upload-profile-picture-cloud", isAuthenticated, uploadfileCloud().single("profilePicture"), userService.uploadProfilePictureCloud);
router.get("/",isAuthenticated,userService.getProfile);
export default router;