import mongoose from "mongoose";
import { UserModel, validatirUser, validatirUserForLogin } from "../models/userSchema.js";
import { hash, compare } from "bcrypt";
import { generateToken } from "../config/generateToken.js";


const addUser = async (req, res) => {
    let validate = validatirUser(req.body);
    if (validate.error)
        return res.status(400).json({ type: "body not valid", message: validate.error.details[0].message });
    let { userEmail, userName, userPassword, role, websiteRegistrationDate } = req.body;
    try {
        let sameUser = await UserModel.findOne({ $or: [{ userName: userName }, { userEmail: userEmail }] });
        if (sameUser)
            return res.status(409).json({ type: "same user", message: "there is user with same details" });
        let hashCode = await hash(userPassword, 10);
        let newUser = await UserModel.create({ userName, userPassword: hashCode, userEmail, role, websiteRegistrationDate });
        let token = generateToken(newUser);
        res.json({ token, userName, userEmail, role,websiteRegistrationDate });
    }
    catch (err) {
        res.status(400).json({ type: "post-error", message: "cannot add user" });
    }

}
const login = async (req, res) => {
    let validate = validatirUserForLogin(req.body);
    if (validate.error)
        return res.status(400).json({ type: "body not valid", message: validate.error.details[0].message });
    let { userEmail, userPassword } = req.body;
    try {
        let user = await UserModel.findOne({ userEmail });
        if (!user || !await compare(userPassword, user.userPassword))
            return res.status(404).json({ type: "no such user", message: "please sign up" });
        let token = generateToken(user);
        res.json({ token });

    }
    catch (err) {
        res.status(400).json({ type: "login-error", message: err.message});
    }
}
const getAllUsers=async(req,res)=>{
    try{
        let allUsers=await UserModel.find({},"-userPassword");
        res.json(allUsers);
    }
    catch(err){
        res.status(400).json({ type: "get-error", message: "cannot get user" });
    }
}
export { addUser, login,getAllUsers };