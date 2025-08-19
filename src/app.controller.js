import { connectDB } from "./DB/connection.js";
import{authRouter, userRouter, messageRouter} from "./modules/index.js";
import cors from "cors";
import { globalErrorHandler } from "./utilies/error/index.js";
export  function bootstrap  (express, app) {
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/messages", messageRouter);
    app.use("/uploads", express.static("uploads"));
    app.use(globalErrorHandler);
}