import express from "express";
import {getDatabase, tokenMap} from "../../server";
import {TShirt} from "../../types/TShirt";
import {TSHIRTS_COLLECTION} from "../../Constants";
import crypto from "crypto";
import {User} from "../../types/User";

const tShirtsRouter = express.Router();

tShirtsRouter.get("/", async (req, res) => {
    let allTShirts = await getDatabase().collection(TSHIRTS_COLLECTION).find().toArray();
    const tshirts = allTShirts.map(tshirt => {
        delete tshirt._id
        return tshirt
    })

    res.json(tshirts)
})

tShirtsRouter.put("/", async (req, res) => {
    const tshirt: TShirt = req.body
    if (!tshirt) {
        res.status(400).json({error: "invalid tshirt..."})
        return
    }
    await getDatabase().collection(TSHIRTS_COLLECTION).insertOne(tshirt)
    res.json({message: "Successfully inserted tshirt.", tshirt})
})




export default tShirtsRouter
