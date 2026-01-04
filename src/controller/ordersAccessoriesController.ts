import { Request , Response } from "express"
import { OrdersAccessories } from "../model/ordersAccessriesModel"
import { sendOrderConfirmationMailAccessories } from "../util/sendMail"

export const createOrdersAccessories = async(req:Request , res:Response)=>{
    const {email ,firstname,lastname,address,paymentmethod,amount,orderDate,orderType,itemname,description,price,qty} = req.body

    if(!email || !firstname || !lastname || !address || !paymentmethod){
        return res.status(400).json({ message: "All fields are required" })
    }

    const newOrdeAccessoriesDetail = new OrdersAccessories({
        email, 
        firstname,
        lastname,
        address,
        paymentmethod,
        amount,
        orderDate,
        orderType,
        itemname,
        description,
        price,
        qty,
    })

    await sendOrderConfirmationMailAccessories(
        email,
        firstname,
        address,
        orderDate,
        orderType,
        itemname,
        price,
        qty,
        newOrdeAccessoriesDetail._id.toString()
    );

    await newOrdeAccessoriesDetail.save()
    res.status(201).json({message: "Order created successfully",
        data: newOrdeAccessoriesDetail
    })
}


export const getAllAccessoriesOrders = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const orderAccesssories = await OrdersAccessories
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await OrdersAccessories.countDocuments();
        return res.status(200).json({
            message: 'Orders Details get Successful',
            data: orderAccesssories,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const updateOrderStatusAccess = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const allowedStatus = ["pending", "success", "cancelled"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedOrder = await OrdersAccessories.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const getOrdersByUserAccess = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const orders = await OrdersAccessories.find({ email }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        return res.status(200).json({
            message: "User orders fetched successfully",
            data: orders
        });

    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};