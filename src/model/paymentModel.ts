import mongoose, { Document, Schema } from "mongoose";


export interface IPayment extends Document{
    _id:mongoose.Types.ObjectId
    email : string
    phonenumber : string
    cardHolderName : string
    cardNumber : string
    expireDate : string
    cvv : string
    paymentDate : string
    amount : string
}

const paymentSchema  = new Schema<IPayment>({
    email :{type:String , required:true},
    phonenumber : {type:String , required:true},
    cardHolderName : {type:String , required:true},
    cardNumber : {type:String , required:true},
    expireDate : {type:String , required:true},
    cvv : {type:String , required:true},
    paymentDate : {type:String , required:true},
    amount : {type:String , required:true},
},{
    timestamps:true
}
)

export const Payemnt = mongoose.model<IPayment>("Payment", paymentSchema)