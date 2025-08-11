import { connectDB } from "./DB/connection.js";
import{authRouter, userRouter, messageRouter} from "./modules/index.js";
import cors from "cors";
export  function bootstrap  (express, app) {
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/messages", messageRouter);
    app.use("/uploads", express.static("uploads"));
    app.use((err, req, res, next) => {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        res.status(err.cause || 500).json({ message: err.message, success: false, error: err.stack });
    });
}