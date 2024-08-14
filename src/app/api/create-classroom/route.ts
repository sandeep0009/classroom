import { dbConnect } from "@/lib/dbConnect";
import classroomModel from "@/models/classroomSchema";
import userModel from "@/models/userSchema";
import { NextResponse } from "next/server";

dbConnect()
export async function POST(req:Request){
    try {
        const {name, startTime, endTime, daysInSession, teacherId,studentIds} = await req.json();
        if(!(name || startTime || endTime || daysInSession || teacherId || studentIds)){
            return NextResponse.json({message:"Error: provide all required fields"},{status:400})
        }

        const teacherAlreadyAssign = await classroomModel.findOne({teacherId});

        if(teacherAlreadyAssign){
            return NextResponse.json({message:"Teacher is already assigned"},{status:400});
        }

        const newClassroom = await classroomModel.create({
            name,
            startTime,
            endTime,
            daysInSession,
            teacherId,
            studentIds
        });


        await userModel.updateOne(
            {_id:teacherId,role:'teacher'},
            {classroomId:newClassroom._id}
        )

        if(studentIds &&  studentIds.length>0){
            await userModel.updateMany(
                {
                    _id:{$in:studentIds},
                    role:"student"
                },
                {
                    classroomId:newClassroom._id
                }
            )
        }

      

        return NextResponse.json({message:"Classroom saved", newClassroom},{status:201});
        
    } catch (error) {
        console.log("Error in creating classroom", error);
        return NextResponse.json({message:"Error in creating classroom"},{status:500})
    }
}