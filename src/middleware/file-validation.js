import fs from "fs";
import {fileTypeFromBuffer} from "file-type"
export const fileValidation = (allowedType=["image/png" ,"image/jpeg"])=>{
    return async (req, res ,next)=>{
        const filePath =req.file.path ;
        const buffer = fs.readFileSync(filePath);
        const type =await fileTypeFromBuffer(buffer) ;
        if(!type || allowedType.includes(type.mime)){
            return next(new Error("invalid file formate" ,{cause:400}));
        }else{
            return next() ;
        }
    };
}