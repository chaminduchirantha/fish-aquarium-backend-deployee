import mongoose, { Document, Schema } from "mongoose";

export interface IOrderFish extends Document{
    _id:mongoose.Types.ObjectId
    email :string
    firstname : string 
    lastname : string
    address : string
    paymentmethod : string
    amount : string
    orderType :string
    orderDate : string
    fishname : string
    price : string
    qty : number,
    status?: string;
    creatAt? : Date
    updatedAt? : Date
}

const OrdersfishSchema = new Schema<IOrderFish>({
    email : {type:String , required:true},
    firstname :{type:String , required:true},
    lastname : {type:String , required:true},
    address : {type:String , required:true},
    paymentmethod : {type:String , required:true},
    amount : {type:String , required:true},
    orderType :{type:String , required:true},
    orderDate : {type:String , required:true},
    fishname : {type:String , required:true},
    price : {type:String , required:true},
    qty : {type:Number , required:true},
    status: {
        type: String,
        enum: ["pending", "success", "cancelled"],
        default: "pending",
    },
},{
    timestamps:true
})

export const OrdersFish = mongoose.model<IOrderFish>("OrdersFish", OrdersfishSchema)