import { dbConnect } from "@/lib/dbConnect";
import timetableModel from "@/models/timetableSchema";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Classroom ID is required' }, { status: 400 });
        }

        const body = await req.json();
        console.log(body);

        if (!Array.isArray(body.entries) || body.entries.length === 0) {
            return NextResponse.json({ message: 'Entries array is required and must not be empty' }, { status: 400 });
        }

        const createdEntries = await Promise.all(body.entries.map(async (entry:any) => {
            if (!entry.day || !entry.subject || !entry.startTime || !entry.endTime) {
                throw new Error('Missing required fields in an entry');
            }

            return await timetableModel.create({
                day: entry.day,
                subject: entry.subject,
                startTime: entry.startTime,
                endTime: entry.endTime,
                classroomId: id,
            });
        }));

        return NextResponse.json({ message: 'Timetable entries created successfully', createdEntries }, { status: 201 });
    } catch (error) {
        console.error("Error in creating timetable:", error);
        return NextResponse.json({ message: 'Error in creating timetable', error: error }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Classroom ID is required' }, { status: 400 });
        }

        const timeTableDetails = await timetableModel.find({ classroomId: id });

        if (timeTableDetails.length === 0) {
            return NextResponse.json({ message: "No timetable found for this classroom" }, { status: 404 });
        }

        return NextResponse.json({ message: "Fetched all timetable details", timeTableDetails }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching timetable:", error);
        return NextResponse.json({ message: 'Error in fetching timetable', error: error }, { status: 500 });
    }
}
