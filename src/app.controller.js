import { connectDB } from "./DB/connection.js";
import{authRouter, userRouter, messageRouter} from "./modules/index.js";
import cors from "cors";
import { globalErrorHandler } from "./utilies/error/index.js";
import rateLimit from "express-rate-limit";
export  function bootstrap  (express, app) {
    app.use(cors({ origin: "*" }));
    
    const limiter = rateLimit({
        windowMs: 5*60*1000 ,
        limit:5,
        handler:(req,res,next,options) => {
            res.status(options.statusCode).json({ message: options.message, success: false });
        },
        identifier:(req,res) => {
            return req.ip;
        }
    })
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter);
    app.use("/uploads", express.static("uploads"));
    app.use(globalErrorHandler);
}