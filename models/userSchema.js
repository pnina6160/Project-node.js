import mongoose from "mongoose";
import Joi from "joi";
const userSchema=mongoose.Schema({
    userEmail:String,
    userName:String,
    userPassword:String,
    role:{type:String,default:"USER"},
    websiteRegistrationDate: { type: Date, default: Date.now() },
})
export const UserModel = mongoose.model("user", userSchema);

export const validatirUser=(user)=>{
    const schema=Joi.object({
        userEmail:Joi.string().email().required(),
        userName:Joi.string().min(3).max(10).required(),
        userPassword:Joi.string().pattern(/^[a-zA-Z0-9]{4,8}$/).required(),
        // role:Joi.string().valid('USER','ADMIN'),
        websiteRegistrationDate:Joi.date().less('now')
    })
    return schema.validate(user);
}

export const validatirUserForLogin=(user)=>{
    const schema=Joi.object({
        userEmail:Joi.string().email().required(),
        userPassword:Joi.string().pattern(/^[a-zA-Z0-9]{4,8}$/).required()
    })
    return schema.validate(user);
}

