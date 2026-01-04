import { Router } from "express"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../model/user"
import { createOrdersAccessories, getAllAccessoriesOrders, getOrdersByUserAccess, updateOrderStatusAccess } from "../controller/ordersAccessoriesController"

const router = Router()

router.post("/createOrders",  authenticate , requireRole([Role.USER]) ,createOrdersAccessories)
router.get("/allOrders" , authenticate ,requireRole([Role.ADMIN]), getAllAccessoriesOrders)
router.put("/updateStatus/:id",authenticate,requireRole([Role.ADMIN]),updateOrderStatusAccess);
router.get("/viewOrder/:email", getOrdersByUserAccess);


export default router