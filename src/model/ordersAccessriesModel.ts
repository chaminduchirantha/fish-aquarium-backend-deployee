import mongoose, { Document, Schema } from "mongoose";

export interface IOrderAccessories extends Document{
    _id:mongoose.Types.ObjectId
    email :string
    firstname : string 
    lastname : string
    address : string
    paymentmethod : string
    amount : string
    orderType :string
    orderDate : string
    itemname : string
    description :string
    price : string
    qty : number
    status?: string;
    creatAt? : Date
    updatedAt? : Date
}

const OrdersAccessriesSchema = new Schema<IOrderAccessories>({
    email : {type:String , required:true},
    firstname :{type:String , required:true},
    lastname : {type:String , required:true},
    address : {type:String , required:true},
    paymentmethod : {type:String , required:true},
    amount : {type:String , required:true},
    orderType :{type:String , required:true},
    orderDate : {type:String , required:true},
    itemname : {type:String , required:true},
    description : {type:String , required:true},
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

export const OrdersAccessories = mongoose.model<IOrderAccessories>("OrdersAccessories", OrdersAccessriesSchema)