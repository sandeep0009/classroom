import userModel from "@/models/userSchema";
import { NextResponse } from "next/server";


export async function GET(req:Request){
    try {

        const getAllStudents=await userModel.find({role:'student'});

        return NextResponse.json({message:'all students fetched successfully',getAllStudents},{status:200})
        
    } catch (error) {
        console.log("error in fetching all students",error);
        return NextResponse.json({message:"error in fetching students"},{status:404})
        
    }
}