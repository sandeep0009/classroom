import timetableModel from "@/models/timetableSchema";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try {

        const url=new URL(req.url);
        const id=url.searchParams.get('id');

        const {startTime,endTime,subject,day,}=await req.json();

        const createTimeTable=await timetableModel.create({
            subject,
            endTime,
            startTime,
            day,
            classroomId:id
        })

        await createTimeTable.save();


        return NextResponse.json({message:'time table created successfully',createTimeTable},{status:201});
        
    } catch (error) {
        console.log("error in creating timetable",error);
        return NextResponse.json({messaeg:'error in creating timetable'},{status:404})
        
    }
}


export async function GET(req:Request){
    try {

        const url=new URL(req.url);
        const id=url.searchParams.get('id');

        const timeTableDetails=await timetableModel.find({classroomId:id});

        if(!timeTableDetails){
            return NextResponse.json({message:"it doesnt exist"},{status:400})
        }

        return NextResponse.json({message:"all fetched time table details",timeTableDetails},{status:200});
        
    } catch (error) {
        console.log("error in fetching time table",error);
        return NextResponse.json({message:'error in fetching time table'},{status:404});
        
    }
}


