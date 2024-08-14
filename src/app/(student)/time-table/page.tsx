"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { axiosInstance } from '@/lib/axiosInstance';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TimetableEntry {
    day: string;
    subject: string;
    startTime: string;
    endTime: string;
}

const Page = () => {
    const { data: session } = useSession();
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const classRoomId = session?.user?.classroomId;

    const getTimeTable = useCallback(async (): Promise<void> => {
        if (classRoomId) {
            try {
                const res = await axiosInstance().get(`/api/timetable?id=${classRoomId}`);
                console.log(res.data)
                
                setTimetable(res.data.timeTableDetails); 
            } catch (error) {
                console.error("Failed to fetch timetable:", error);
            }
        }
    },[classRoomId]);

    useEffect(() => {
        getTimeTable();
    },[getTimeTable]);

    return (
        <div className="flex flex-col max-w-xl justify-center m-auto py-4 border border-grey-100 rounded-md px-4 mt-3">
            <div className='text-xl font-bold mb-4'>
                Timetable for Classroom
            </div>

<div className='w-full'>
<Table className="w-full border-collapse">
  <TableHeader>
    <TableRow>
      <TableHead>Day</TableHead>
      <TableHead>Subject</TableHead>
      <TableHead>Start Time</TableHead>
      <TableHead>End Time</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {timetable.map((entry, index) => (
      <TableRow key={index}>
        <TableCell >{entry.day}</TableCell>
        <TableCell >{entry.subject}</TableCell>
        <TableCell >{entry.startTime}</TableCell>
        <TableCell >{entry.endTime}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</div>
        </div>
    );
};

export default Page;
