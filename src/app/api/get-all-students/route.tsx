import userModel from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/redisLimiter";


export async function GET(req:NextRequest){
    try {

        const limitResult = await rateLimiter(req);
        if (limitResult){
            return limitResult;
        }

        const url=new URL(req.url);
        const page=parseInt(url.searchParams.get('page')||'1',10);
        const limit=parseInt(url.searchParams.get('limit')||'5',10);
        const skip=(page-1)*limit;

        const searchQuery=url.searchParams.get('search') || '';
        console.log(searchQuery)

        const filter={
            role:'student',
            $or:[
                {name:{$regex:searchQuery,$options:'i'}},
                {email:{$regex:searchQuery,$options:'i'}}

            ]
        }

        const totalStudents=await userModel.countDocuments(filter);
        const getAllStudents=await userModel.find(filter).skip(skip).limit(limit);

        return NextResponse.json({message:'all students fetched successfully',
            data:getAllStudents,
            pagination:{
                totalStudents,
                page,
                limit,
                totalPages:Math.ceil(totalStudents/limit)
            }
        
        },
            {status:200}
        )
        
    } catch (error) {
        console.log("error in fetching all students",error);
        return NextResponse.json({message:"error in fetching students"},{status:404})
        
    }
}