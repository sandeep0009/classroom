import userModel from "@/models/userSchema";
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server"
import { dbConnect } from "@/lib/dbConnect";



dbConnect()
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        
        
        let teacherExist = await userModel.findOne({ email, role: 'teacher' });
        
        if (teacherExist) {
            return NextResponse.json({ message: "Teacher already exists" }, { status: 403 });
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const newTeacher = await userModel.create({
            email,
            password: hashPassword,
            role:'teacher'
        });
        
        return NextResponse.json({ message: "Teacher created successfully", newTeacher }, { status: 201 });
    } catch (error) {
        console.log("Error in the post of teachers", error);
        return NextResponse.json({ message: "Error in creating teacher" }, { status: 400 });
    }
}


export async function GET(req:NextRequest){
    try {


        const getAllTeachers=await userModel.find({role:'teacher'});

        return NextResponse.json({message:"all teacher details are here",getAllTeachers},{status:201});

        
    } catch (error) {

        console.log("error in the teacher get route",error);
        return NextResponse.json({message:"errror in the get route of teacher"},{status:404})
        
    }
}



export async function DELETE(req:NextRequest){
    try {

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        await userModel.findByIdAndDelete(id);
        return NextResponse.json({message:"deleted successfully"},{status:200});

        
    } catch (error) {
        console.log("error in the teacher delete route",error);
        return NextResponse.json({message:"errror in the delete route of teacher"},{status:404})
        

        
    }
}



export async function PATCH(req:NextRequest){
    try {

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const body=await req.json();

        const updatedUser = await userModel.findByIdAndUpdate(id,body,{new:true});
        return NextResponse.json({message:"updated successfully",updatedUser},{status:200});

        
    } catch (error) {
        console.log("error in the teacher delete route",error);
        return NextResponse.json({message:"errror in the delete route of teacher"},{status:404})
        

        
    }
}