import { Request, Response } from 'express';
import { Feedback } from '../model/feedbackModel';

export const creaetFeedback = async(req: Request , res:Response)=>{
    const {customername , email , ratings , feedback} = req.body

    if(!customername || !email || !ratings || !feedback ){
        return res.status(400).json({ message: "All fields are required" })
    }

    const newFeedback = new Feedback({
        customername, 
        email,
        ratings,
        feedback
    })

    await newFeedback.save()

    res.status(201).json({
      message:"Feedback Create Successfully",
      data: {
        id: newFeedback._id,
        email: newFeedback.email,
        ratings: newFeedback.ratings,
      }
    })
}


export const getAllFeedback = async(req: Request , res:Response)=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const user = await Feedback.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Feedback.countDocuments();
        return res.status(200).json({
            message: 'Feedabck Details get Successful',
            data: user,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}