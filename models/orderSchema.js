import mongoose from "mongoose";
import Joi from "joi";


const minimalProduct=mongoose.Schema({
    productName: String,
    price: Number,
    imagePath: String,
    account:Number,   
});

const orderSchema = mongoose.Schema({
    orderDate: { type: Date, default: Date.now() },
    dedLine: {
        type: Date, default: function () {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return currentDate;
        }
    },
    orderAddress: String,
    invaitingCode: String,
    orderedProducts: [minimalProduct],
    orderInTheWay:{type:Boolean,default:false}
});

export const OrderModel =mongoose.model("orders",orderSchema);

export const validatorOrder=(order)=>{
    const schema=Joi.object({
        orderAddress:Joi.string().min(2).required(),
        orderedProducts:Joi.array().required(),
        dedLine:Joi.date().greater('now'),
    });
    return schema.validate(order);
}

export const validatorMinimalProduct=(prod)=>{
    const schema=Joi.object({
        productName:Joi.string().required(),
        price:Joi.number().min(250).max(2500),
        account:Joi.number().required()
    });
    return schema.validate(prod);
}

