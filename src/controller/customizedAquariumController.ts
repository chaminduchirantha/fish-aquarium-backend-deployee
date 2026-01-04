import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { CustomizedAquarium } from "../model/customizedAquarium"
import { AuthRequest } from "../middleware/auth"


export const create = async(req:AuthRequest , res:Response)=>{

    try{
    const {customername, phonenumber, email, address, width, height, length, material, extrafeatures, notes} = req.body

    const existing = await CustomizedAquarium.findOne({ email });
    if (existing) {
        return res.status(400).json({ message: "This email already exists. Please use another email." });
    }


        let imageUrl = ""

        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    {folder: "post"},
                    (err, result) => {
                        if (err) return reject(err)
                        resolve(result)
                    }
                )

                upload_stream.end(req.file?.buffer)

            })
            imageUrl  = result.secure_url
        }


        const newDetails = new CustomizedAquarium({
            customername,
            phonenumber,
            email,
            address,
            width,
            height,
            length,
            material,
            extrafeatures,
            notes,
            imageUrl,
            auther:req.user?.sub
        })

        await newDetails.save()
        res.status(201).json({message: "Post created",
            data: newDetails
        })

    }catch(erorr){
        console.error(erorr)
        res.status(500).json({message: "Fail to save post"} )
    }
}

export const getDetails = async (req:AuthRequest , res:Response) => {
     try {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await CustomizedAquarium.find()
      .populate('auther', 'customername email phonenumber address image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CustomizedAquarium.countDocuments();
    return res.status(200).json({
      message: 'Posts data',
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get post.!' });
  }
}