import { Request, Response } from 'express';
import { User } from '../model/user';

export const getUserAll = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const user = await User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await User.countDocuments();
        return res.status(200).json({
            message: 'User Details get Successful',
            data: user,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}




