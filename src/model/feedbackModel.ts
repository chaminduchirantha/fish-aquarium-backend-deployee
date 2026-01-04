import mongoose, { Schema } from "mongoose"

export interface IFeedback extends Document{
    _id:mongoose.Types.ObjectId
    customername :string
    email : string 
    ratings : number
    feedback : string
    creatAt? : Date
    updatedAt? : Date
}

const feedbackSchema = new Schema<IFeedback>({
    customername :{type:String , required:true},
    email : {type:String , required:true},
    ratings : {type:Number , required:true , min:1 , max: 5},
    feedback : {type:String , required:true},
},{
    timestamps:true
})

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema)
