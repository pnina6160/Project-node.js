import { config } from "dotenv";
import  express  from "express";
import { connectToDB } from "./config/dbConfig.js";
import { errorHandling } from "./middlewares/errorHandlingmiddleware.js";
import orderRouter from "./routes/orderRoute.js";
import productRouter from "./routes/productRoute.js";
import userRouter from"./routes/userRoute.js";
import cors from "cors"

config();
connectToDB();
const app=express();
app.use(express.json());
app.use(cors({origin:"http://localhost:5000"}))

app.use("/api/products",productRouter);
app.use("/api/users",userRouter);
app.use("/api/orders",orderRouter)
app.use(errorHandling);


let port=process.env.PORT;
app.listen(port,()=>{
    console.log(` app is listening on port ${port} `);
})