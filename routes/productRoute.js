import express  from "express";
import { getAllProduct ,getProductById,addProduct,deleteProduct, updateProduct} from "../controllers/productController.js";
import { authAdmin } from "../middlewares/auth.js";

const router=express.Router();
router.get('/',getAllProduct);
router.get('/:id',getProductById);
router.post('/',authAdmin,addProduct);
router.delete('/:id',authAdmin,deleteProduct);
router.put('/:id',authAdmin,updateProduct);
export default router;