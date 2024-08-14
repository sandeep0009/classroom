import userModel from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/redisLimiter";


export async function GET(req:NextRequest){
    try {

        const limitResult = await rateLimiter(req);
        if (limitResult){
            return limitResult;
        }

        const getAllStudents=await userModel.find({role:'student'});

        return NextResponse.json({message:'all students fetched successfully',getAllStudents},{status:200})
        
    } catch (error) {
        console.log("error in fetching all students",error);
        return NextResponse.json({message:"error in fetching students"},{status:404})
        
    }
}