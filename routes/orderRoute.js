import express from "express";
import { addOrder, deleteOrder, getAllOrders, getAllOrdersByinvatingCode, updateOrder } from "../controllers/orderController.js";
import { auth, authAdmin } from "../middlewares/auth.js";


const router=express.Router();
router.get('/',authAdmin,getAllOrders);
router.delete('/:id',auth,deleteOrder);
router.post('/',auth,addOrder);
router.get('/byInvatingCode',auth,getAllOrdersByinvatingCode);
router.put('/:id',authAdmin,updateOrder);


export default router;