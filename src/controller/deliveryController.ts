import { Request,Response} from "express"
import { Delivery } from "../model/deliveryModel"
import { sendDeliveryEmail } from "../util/sendMail"

export const saveDelivery =async (req:Request , res:Response) =>{
    const {customername , phonenumber , email , address , city , deliveryDate, deliveryTime , postelCode , location} = req.body

    if(!customername || !phonenumber || !email || !address || !city || !postelCode || !deliveryDate || !deliveryTime){
        return res.status(400).json({ message: "All fields are required" })
    }
    

    const newDelivery = new Delivery({
        customername, 
        phonenumber,
        email,
        address,
        city,
        deliveryDate,
        deliveryTime,
        postelCode,
        location: location
        ? { lat: location.lat, lng: location.lng }
        : { lat: null, lng: null },
    })

    const saved = await newDelivery.save()

    await sendDeliveryEmail(saved);

    res.status(201).json({
      message:"Feedback Create Successfully",
      data: newDelivery
    })
}

export const getAllDelivery = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const orderFish = await Delivery.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Delivery.countDocuments();
        return res.status(200).json({
            message: 'Delivery Details get Successful',
            data: orderFish,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}