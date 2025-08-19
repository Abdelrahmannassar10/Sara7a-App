import multer from "multer";
 export const uploadfile =({folder,allowedType=["image/png" ,"image/jpeg"]}={})=>{
    const storage = multer.diskStorage({});
    const fileFilter = (req, file, cb) => {
        if(allowedType.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb( new Error("invalid file formate",{cause:400}));
        }
    };
    return multer({ fileFilter,storage });
};