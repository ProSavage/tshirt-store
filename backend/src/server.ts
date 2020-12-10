import express from "express";
import mongodb from "mongodb";
import * as dotenv from "dotenv";
import tShirtsRouter from "./routes/tshirts/TShirtsRouter";
import bodyParser from "body-parser";
import authRouter from "./routes/auth/AuthRouter";
import {User} from "./types/User";
const app = express();
const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017", {useUnifiedTopology: true});

export const getDatabase = () => {
    return mongoClient.db(process.env.MONGODB_DB_NAME || "tshirt-store")
}

export const tokenMap = new Map<string, User["email"]>();





app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use("/tshirts", tShirtsRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("ok")
})


mongoClient.connect((err) => {
    console.log("connected to database...")
    app.listen(5000, () => console.log("started store backend..."))
})

