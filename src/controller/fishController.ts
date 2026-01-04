import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Fish } from '../model/fishModel';

export const createFish = async (req:Request, res:Response) => {

    const {fishName , price , description , fishCategory} = req.body

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

    const fishDetails = new Fish({
        fishName,
        price,
        description,
        fishCategory,
        imageUrl
    })

    await fishDetails.save()
    res.status(201).json({message: "Fish Details created",
        data: fishDetails
    })
}

export const getAll = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const fish = await Fish.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Fish.countDocuments();
        return res.status(200).json({
            message: 'Fish Details get Successful',
            data: fish,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const updateFish = async(req:Request, res:Response) =>{
     try {
    const { id } = req.params;
    const { fishName, price, description, fishCategory } = req.body;

    const existingFish = await Fish.findById(id);
    if (!existingFish) {
      return res.status(404).json({ message: "Fish not found" });
    }

    let imageUrl = existingFish.imageUrl;

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

    const updatedFish = await Fish.findByIdAndUpdate(
      id,
      {
        fishName,
        price,
        description,
        fishCategory,
        imageUrl,
      },
      { new: true } 
    );

    res.status(200).json({
      message: "Fish details updated successfully",
      data: updatedFish,
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
}

export const deleteFish = async(req:Request, res:Response) =>{
    try {
    const { id } = req.params;

    const fish = await Fish.findById(id);
    if (!fish) {
      return res.status(404).json({ message: "Fish not found" });
    }

    await Fish.findByIdAndDelete(id);

    res.status(200).json({
      message: "Fish deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
}

export const searchFish = async (req: Request, res: Response) => {
  try {
    const { query, category, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter
    const filter: any = {};

    if (query) {
      filter.fishName = { $regex: query, $options: "i" }; // case-insensitive search
    }

    if (category) {
      filter.fishCategory = category;
    }

    const fish = await Fish.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Fish.countDocuments(filter);

    return res.status(200).json({
      message: "Search results",
      data: fish,
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
