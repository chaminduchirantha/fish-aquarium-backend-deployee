import mongoose, { Document, Schema } from "mongoose";

export interface IFish extends Document{
    _id:mongoose.Types.ObjectId
    fishName :string
    price : string 
    description : string
    fishCategory : string
    imageUrl : string
    creatAt? : Date
    updatedAt? : Date
}

const fishSchema = new Schema<IFish>({
    fishName :{type:String , required:true},
    price : {type:String , required:true},
    description : {type:String , required:true},
    fishCategory : {type:String , required:true},
    imageUrl : {type:String , required:true},
},{
    timestamps:true
})

export const Fish = mongoose.model<IFish>("Fish", fishSchema)