import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Accessories } from '../model/accessoriesModel';



export const createAccessories = async (req:Request, res:Response)=>{
    const {itemname , price , description } = req.body

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

    const accessoriesDetails = new Accessories({
        itemname,
        price,
        description,
        imageUrl
    })

    await accessoriesDetails.save()
    res.status(201).json({message: "Fish Details created",
        data: accessoriesDetails
    })
}

export const getAccessories = async (req:Request, res:Response)=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const accessories = await Accessories.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Accessories.countDocuments();
        return res.status(200).json({
            message: 'Accessories Details get Successful',
            data: accessories,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const updateAccessories = async (req:Request, res:Response)=>{
    try {
        const { id } = req.params;
        const { itemname, price, description } = req.body;
    
        const existingAccessories = await Accessories.findById(id);
        if (!existingAccessories) {
          return res.status(404).json({ message: "Accessories not found" });
        }
    
        let imageUrl = existingAccessories.imageUrl;
    
        if (req.file) {
          const fileBuffer = req.file.buffer;
          const result: any = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
              { folder: "post" },
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            );
            upload_stream.end(fileBuffer);
          });
    
          imageUrl = result.secure_url;
        }
    
        const updatedFish = await Accessories.findByIdAndUpdate(
          id,
          {
            itemname,
            price,
            description,
            imageUrl,
          },
          { new: true } 
        );
    
        res.status(200).json({
          message: "Accessories details updated successfully",
          data: updatedFish,
        });
    
      } catch (error: any) {
        res.status(500).json({
          message: "Update failed",
          error: error.message,
        });
      }
    }


export const deleteAccessories = async (req:Request, res:Response)=>{
     try {
        const { id } = req.params;
    
        const fish = await Accessories.findById(id);
        if (!fish) {
          return res.status(404).json({ message: "Accessories not found" });
        }
    
        await Accessories.findByIdAndDelete(id);
    
        res.status(200).json({
          message: "Accessories deleted successfully",
        });
      } catch (error: any) {
        res.status(500).json({
          message: "Delete failed",
          error: error.message,
        });
    }
}


export const searchAcccessories = async (req: Request, res: Response) => {
  try {
    const { query,page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter
    const filter: any = {};

    if (query) {
      filter.itemname = { $regex: query, $options: "i" };
    }

    const accessories = await Accessories.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Accessories.countDocuments(filter);

    return res.status(200).json({
      message: "Search results",
      data: accessories,
      totalPages: Math.ceil(total / limitNumber),
      totalCount: total,
      page: pageNumber,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};