import mongoose, { Document, Schema } from "mongoose";

export interface IAccessories extends Document{
    _id:mongoose.Types.ObjectId
    itemname :string
    price : string 
    description : string
    imageUrl : string
    creatAt? : Date
    updatedAt? : Date
}

const fishSchema = new Schema<IAccessories>({
    itemname :{type:String , required:true},
    price : {type:String , required:true},
    description : {type:String , required:true},
    imageUrl : {type:String , required:true},
},{
    timestamps:true
})

export const Accessories = mongoose.model<IAccessories>("Accessories", fishSchema)