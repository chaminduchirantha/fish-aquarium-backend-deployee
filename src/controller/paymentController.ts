import { Request,Response } from "express"
import { Payemnt } from "../model/paymentModel"
import bcrypt from "bcryptjs"
import { AuthRequest } from "../middleware/auth"
import { sendOrderConfirmationMailPayment } from "../util/sendMail"

export const savePayment = async(req:Request , res:Response)=>{
    const {email , phonenumber , cardHolderName , cardNumber , expireDate , cvv, paymentDate , amount} = req.body
    
    if(!email || !phonenumber || !cardHolderName || !cardNumber || !expireDate || !cvv || !paymentDate || !amount){
        return res.status(400).json({ message: "All fields are required" })
    }

    const hasheCardNumber = await bcrypt.hash(String(cardNumber), 10)
    const hasheCvv = await bcrypt.hash(String(cvv), 10)
    const hasheExpireDate = await bcrypt.hash(String(expireDate), 10)

    const newPayement = new Payemnt({
        email, 
        phonenumber,
        cardHolderName,
        cardNumber:hasheCardNumber,
        expireDate:hasheExpireDate,
        cvv:hasheCvv,
        paymentDate,
        amount
    })

    await sendOrderConfirmationMailPayment(
            email,
            cardHolderName,
            phonenumber,
           newPayement._id.toString()
    );

    await newPayement.save()

    res.status(201).json({
        message:"Payment Create Successfully",
        data: newPayement
    })
}


export const getAllPayment = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const orderFish = await Payemnt.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Payemnt.countDocuments();
        return res.status(200).json({
            message: 'Payment Details get Successful',
            data: orderFish,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const getPaymentByUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const orders = await Payemnt.find({ email }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No Payment found for this user" });
        }

        return res.status(200).json({
            message: "User Payment fetched successfully",
            data: orders
        });

    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
