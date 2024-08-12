import { dbConnect } from "@/lib/dbConnect"
import userModel from "@/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req:Request){
    try {
        await dbConnect();
        const data=await req.json();

        const userExist=await userModel.find({email:data.email})

        if(userExist){
            return NextResponse.json({message:"already existing email"},{status:404})
        }

        const hashedPassword=await bcrypt.hash(data.password,10);

        const newUser=await userModel.create({
            data:{
                email:data.email,
                password:hashedPassword,
                role:data.role

            }
        })

        await newUser.save();
        return NextResponse.json({message:"successfully created",newUser},{status:201});
        
    } catch (error) {
        console.log("Error in the post route of signin",error)
        return NextResponse.json({message:"error in signin"},{status:404})
        
    }
}