import mongoose, { Document, Schema } from "mongoose";


export interface IAquarium extends Document{
    _id:mongoose.Types.ObjectId
    customername : string
    phonenumber : string
    email : string
    address : string
    width : string
    height : string 
    length : string 
    material : string
    extrafeatures : string
    notes : string
    imageUrl : string
    auther :mongoose.Types.ObjectId
    creatAt? : Date
    updatedAt? : Date
}

const aquariumSchema  = new Schema<IAquarium>({
    customername :{type:String , required:true},
    phonenumber : {type:String , required:true},
    email : {type:String , required:true , unique:true},
    address : {type:String , required:true},
    width : {type:String , required:true},
    height : {type:String , required:true},
    length : {type:String , required:true},
    extrafeatures : {type:String , required:true},
    notes : {type:String , required:true},
    imageUrl : {type:String},
    auther : {type:Schema.ObjectId ,ref:"User" , required:true}
},{
    timestamps:true
}
)

export const CustomizedAquarium = mongoose.model<IAquarium>("CustomizedAquarium", aquariumSchema)