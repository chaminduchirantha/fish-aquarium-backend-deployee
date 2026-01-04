import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import {IUser, User } from "../model/user"
import { signAccessToken, signRefreshToken } from "../util/token"
import { AuthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"


const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req:Request , res:Response)=>{
    const {firstname , lastname , email , password , role} = req.body

    if(!firstname || !lastname || !email || !password || !role){
        return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(400).json({ message: "Email alrady registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

     const newUser = new User({
      firstname, 
      lastname,
      email,
      password: hashedPassword,
      role: [role],
    })

     await newUser.save()

    res.status(201).json({
      message:"User Register Successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.role,
      }
    })
}

export const login = async(req:Request , res:Response)=>{
    const {email , password} = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials Please Try again Later" })
    } 

       const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials Please Try again Later" })
    }

    const accessToken = signAccessToken(existingUser)
    const refreshToken = signRefreshToken(existingUser) 

    res.status(200).json({
        message : "success",
        data:{
            email : existingUser.email,
            role : existingUser.role,
            accessToken,
            refreshToken
        }
    })
}

export const getMyDetails = async(req:AuthRequest , res:Response)=>{
if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const userId = req.user.sub
  const user =
    ((await User.findById(userId).select("-password")) as IUser) || null

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { firstname, lastname, email, role} = user

  res.status(200).json({
    message: "Ok",
    data: { firstname, lastname, email, role }
  })
}


export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: "Token required" })
    }
    // import jwt from "jsonwebtoken"
    const payload = jwt.verify(token, JWT_REFRESH_SECRET)
    // payload.sub - userID
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }
    const accessToken = signAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" })
  }
}