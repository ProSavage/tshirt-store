import express from "express";
import bcrypt from "bcrypt";
import {getDatabase, tokenMap} from "../../server";
import {USERS_COLLECTION} from "../../Constants";
import {User} from "../../types/User";
import crypto from "crypto";

const authRouter = express.Router()

authRouter.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let user: User | null = await getDatabase().collection(USERS_COLLECTION).findOne({email});
    if (!user) {
        res.status(400).json({error: "Invalid email or password."})
        return
    }

    // if comparison fails, we deny.
    if (!bcrypt.compareSync(password, user.password)) {
        res.status(400).json({error: "Invalid email or password."})
        return
    }

    const token = await generateToken(user);

    res.json({message: "Success", token})
})


authRouter.post("/signup", async (req, res) => {
    const user: User = req.body;

    if (!user) {
        res.status(400).json({error: "invalid body"});
        return
    }

    if (user.password.length < 6) {
        res.status(400).json({error: "password must be 6 chars or longer."})
        return
    }

    let usersWithEmail = await getDatabase().collection(USERS_COLLECTION).find({email: user.email}).toArray();
    if (usersWithEmail.length != 0) {
        res.status(400).json({error: "This email is already taken."})
        return
    }

    // hash the password, so its not plaintext.
    user.password = bcrypt.hashSync(user.password, 10)
    await getDatabase().collection(USERS_COLLECTION).insertOne(user)

    const token = await generateToken(user);

    res.json({message: "success", token})
})

const generateToken = async (user: User) => {
    const token = (await crypto.randomBytes(48)).toString("hex");
    tokenMap.set(token, user.email);
    return token;
}

export default authRouter;
