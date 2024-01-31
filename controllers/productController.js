
import mongoose from "mongoose";
import { ProductModel, validatorProduct, validatorUpdateProduct, validatordescriptionProduct } from "../models/productSchema.js";


const getAllProduct = async (req, res) => {
    let { searchProductName, searchPrice } = req.query;
    let perPage = req.query.perPage || 8;
    let page = req.query.page || 1;
    let exp = new RegExp(`${searchProductName}`);

    try {
        let filter = {};
        if (searchProductName) {
            filter.productName = exp;
            if (searchPrice) {
                filter.price = searchPrice;
            }
        }
        let allProduct = await ProductModel.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json(allProduct);
    }
    catch (err) {
        res.status(400).json({ type: "get-error", message: "cannot get all product" });
    }
}

const getProductById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not validate id", message: "id is not validate" });
        let prod = await ProductModel.findById(id);
        if (!prod)
            return res.status(404).json({ type: "not found", message: "not found product with such id" });
        res.json(prod);

    }
    catch (err) {
        res.status(400).json({ type: "get by id-error", message: err });
    }
}

const addProduct = async (req, res) => {
    let validate = validatorProduct(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', massage: validate.error.details[0].message })
    let validateDescription = validatordescriptionProduct(req.body.description);
    if (validateDescription.error)
        return res.status(400).json({ type: 'not valid body', massage: validateDescription.error.details[0].message })

    try {
        let { productName, description, createDate, price, imagePath } = req.body;
        let sameProd = await ProductModel.findOne({ productName });
        if (sameProd)
            return res.status(409).json({ type: "same product", message: "there is product with same details" });
        let newProduct = await ProductModel.create({ productName, description, createDate, price, imagePath });
        res.json(newProduct);

    }
    catch (err) {
        res.status(400).json({ type: "post-error", message: "cannot add product" });
    }
}
const deleteProduct = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not validate id", message: "id is not validate" });
        let prodToDelete = await ProductModel.findById(id);
        if (!prodToDelete)
            return res.status(404).json({ type: 'not found', message: "not found product to delete with such id" });
        let deleted = await ProductModel.findByIdAndDelete(id);
        res.json(deleted);

    }
    catch (err) {
        res.status(400).json({ type: "dalete-error", message: "cannot delete product" });
    }
}
const updateProduct = async (req, res) => {
    let validate = validatorUpdateProduct(req.body);
    if (validate.error) {
        return res.status(400).json({ type: 'not valid body', massage: validate.error.details[0].message })
    }
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not validate id", message: "id is not validate" });
    try {
        let productToUpdate = await ProductModel.findById(id);
        if (!productToUpdate)
            return res.status(404).json({ type: 'not found', message: "not found to delete with such id" });
        await ProductModel.findByIdAndUpdate(id, req.body);
        let updatedProd = await ProductModel.findById(id);
        res.json(updatedProd);
    }
    catch (err) {
        res.status(400).json({ type: "update-error", message: "cannot update product" });
    }
}
export { getAllProduct, getProductById, addProduct, deleteProduct, updateProduct };
