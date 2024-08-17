import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/userSchema";
import {  NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { rateLimiter } from "@/lib/redisLimiter";



dbConnect()

export async function POST(req:Request){
    try {

        const {name,email,password}=await req.json();
        const studentExist=await userModel.findOne({email,role:'student'})

        if(studentExist){
            return NextResponse.json({message:"student alreayd exist"},{status:400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newStudent = await userModel.create({
            name,
            email,
            password: hashedPassword, 
            role: 'student'
        });

        await newStudent.save();
        return NextResponse.json({message:"student created successfully",newStudent},{status:201});

        
    } catch (error) {
        console.log("error in student route",error)
        return NextResponse.json({message:'error in the student creation'},{status:400})
        
    }
}
export async function GET(req: NextRequest){
    try {

        const limitResult = await rateLimiter(req);
        if (limitResult){
            return limitResult;
        }
        const url = new URL(req.url);
        
        const id = url.searchParams.get('id');
        const page=parseInt(url.searchParams.get('page') || '1',10);
        const limit=parseInt(url.searchParams.get('page') || '5',10);

        const skip=(page-1)*limit;

        const searchQuery=url.searchParams.get('search') || '';
        const filter={
            classroomId:id,
            role:'student',
            $or:[
                {name:{$regex:searchQuery,$options:'i'}},
                {email:{$regex:searchQuery,$options:'i'}}
            ]

        }

        const totalStudents=await userModel.countDocuments(filter);
        const allStudents = await userModel.find(filter).skip(skip).limit(limit);
        return NextResponse.json({message:'all students are here',
            data:allStudents,
            pagination:{
                totalStudents,
                page,
                limit,
                totalPages:Math.ceil(totalStudents/limit)
            }
        
        },{status:200})
        
    } catch (error) {
        console.log('error in get the route of students',error);
        return NextResponse.json({message:'error in the get route of students'},{status:404})
        
    }
}

export async function DELETE(req:NextRequest){
    try {
        const limitResult = await rateLimiter(req);
        if (limitResult){
            return limitResult;
        }
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
       
        
        await userModel.findByIdAndDelete(id);
        return NextResponse.json({message:'student deleted successfullu'},{status:200})
        
    } catch (error) {
        console.log("error in student delete",error)
        return NextResponse.json({message:"error in student delte"},{status:404})
    }
}



export async function PATCH(req:NextRequest){
    try {
        const limitResult = await rateLimiter(req);
        if (limitResult){
            return limitResult;
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const body=await req.json();

        const updatedUser = await userModel.findByIdAndUpdate(id,body,{new:true});
        return NextResponse.json({message:"updated successfully",updatedUser},{status:200});

        
    } catch (error) {
        console.log("error in the teacher delete route",error);
        return NextResponse.json({message:"errror in student update"},{status:404})
        

        
    }
}