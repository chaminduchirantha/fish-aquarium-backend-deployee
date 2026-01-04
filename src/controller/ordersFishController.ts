import { Request , Response } from "express"
import { OrdersFish } from "../model/ordersFishModel"
import { sendOrderConfirmationMail } from "../util/sendMail"

export const createOrders = async(req:Request , res:Response)=>{
    const {email ,firstname,lastname,address,paymentmethod,amount,orderDate,orderType,fishname,price,qty} = req.body

    if(!email || !firstname || !lastname || !address || !paymentmethod){
        return res.status(400).json({ message: "All fields are required" })
    }

    const newOrderFishDetail = new OrdersFish({
        email, 
        firstname,
        lastname,
        address,
        paymentmethod,
        amount,
        orderDate,
        orderType,
        fishname,
        price,
        qty,
    })

    await sendOrderConfirmationMail(
      email,
      firstname,
      address,
      orderDate,
      orderType,
      fishname,
      price,
      qty,

      newOrderFishDetail._id.toString()
    );

    await newOrderFishDetail.save()
    res.status(201).json({message: "Order created successfully and Email sent ",
        data: newOrderFishDetail
    })

}

export const getAllFishOrders = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const orderFish = await OrdersFish.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await OrdersFish.countDocuments();
        return res.status(200).json({
            message: 'Orders Details get Successful',
            data: orderFish,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const updateOrderStatus = async (req: Request, res: Response) => {
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

        const updatedOrder = await OrdersFish.findByIdAndUpdate(
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


export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const orders = await OrdersFish.find({ email }).sort({ createdAt: -1 });

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


