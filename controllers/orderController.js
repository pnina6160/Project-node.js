import mongoose, { isValidObjectId } from "mongoose";
import { OrderModel, validatorOrder, validatorMinimalProduct } from "../models/orderSchema.js";
import { ProductModel } from "../models/productSchema.js";


const getAllOrders = async (req, res) => {
    try {
        let allOrders = await OrderModel.find({});
        res.json(allOrders);
    }
    catch (err) {
        res.status(400).json({ type: "get-error", message: "cannot get ordesrs" });
    }
}

const addOrder = async (req, res) => {
    let validate = validatorOrder(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', massage: validate.error.details[0].message })
    try {
        for (const item of req.body.orderedProducts) {
            let validateProducts = await validatorMinimalProduct(item);
            if (validateProducts.error)
                return res.status(400).json({ type: 'not valid body', message: validateProducts.error.details[0].message });
            let productName = item.productName;
            let productToAdd = await ProductModel.findOne({ productName })
            if (!productToAdd)
                return res.status(404).json({ type: 'not found', message: 'there is no product with such name' });
        }

        let { dedLine, orderInTheWay, orderedProducts, orderAddress } = req.body;
        let invaitingCode = req.user._id;
        let newOrder = await OrderModel.create({ dedLine, orderInTheWay, orderedProducts, orderAddress, invaitingCode });
        res.json(newOrder);
    }
    catch (err) {
        res.status(400).json({ type: "post-error", message: "cannot add order" });
    }
}
const deleteOrder = async (req, res) => {
    let { id } = req.params;
    let { _id } = req.user;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not validate id", message: "id is not validate" });
    try {
        let order = await OrderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: 'not found', message: "not found order to delete with such id" });
        if (_id != order.invaitingCode && req.user.role != "ADMIN") {
            return res.status(403).json({ type: 'no match', message: "You are not allowed to delete an order that you did not make" });
        }
        if (order.orderInTheWay)
            return res.status(400).json({ type: "An order has gone out", message: "An order has been sent, it is not possible to delete it" });
        let deleted = await OrderModel.findByIdAndDelete(id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json({ type: "dalete-error", message: "cannot delete order" });
    }
}
const getAllOrdersByinvatingCode = async (req, res) => {
    try {

        let { _id } = req.user;
        if (req.user.role == "ADMIN" && req.body.invaitingCode)
            _id = req.body.invaitingCode
        let allOrdersByInvaitingCode = await OrderModel.find({ invaitingCode: _id });
        res.json(allOrdersByInvaitingCode);
    }
    catch (err) {
        res.status(400).json({ type: "getByInvaitingCode-error", message: "cannot get order by invaiting code" });
    }
}

const updateOrder = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ type: 'not valid body', massage: validate.error.details[0].message })
    }
    try {
        let order = await OrderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: 'not found', message: "not found to update with such id" });
        await OrderModel.findByIdAndUpdate(id, { orderInTheWay: true });
        let orderToUodate = await OrderModel.findById(id);
        res.json(orderToUodate);
    }
    catch (err) {
        res.status(400).json({ type: "update-error", message: "cannot update order" });
    }
}

export { getAllOrders, deleteOrder, addOrder, getAllOrdersByinvatingCode, updateOrder }