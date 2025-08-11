import multer from "multer";
import fs from "fs";
import { nanoid } from "nanoid";
 export const uploadfile =({folder,allowedType=["image/png" ,"image/jpeg"]}={})=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let dest = `uploads/${req.user.id}/${folder}`;
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            cb(null,nanoid(5)+ "_" + file.originalname);
        }
    });
    const fileFilter = (req, file, cb) => {
        if(allowedType.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb( new Error("invalid file formate",{cause:400}));
        }
    };
    return multer({ fileFilter,storage });
};