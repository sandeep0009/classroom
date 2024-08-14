"use client"
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/lib/axiosInstance';
import { useSession } from 'next-auth/react';


const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(/(AM|PM)/);
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    return new Date(0, 0, 0, adjustedHours, minutes);
};


const getTimeDifference = (start: Date, end: Date) => {
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60)); 
};

interface Classroom {
    startTime: string;
    endTime: string;
    name: string;
}

interface TimetableEntry {
    day: string;
    subject: string;
    startTime: string;
    endTime: string;
}

const Page = () => {
    const { data: session } = useSession();
    const [classroom, setClassRoom] = useState<Classroom>({ name: '', startTime: '', endTime: '' });
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [newEntry, setNewEntry] = useState<TimetableEntry>({ day: '', subject: '', startTime: '', endTime: '' });
    const classroomId = session?.user?.classroomId;

    const getClassRoom = async (): Promise<void> => {
        if (classroomId) {
            const res = await axiosInstance().get(`/classroom?id=${classroomId}`);
            const { startTime, endTime } = res.data.classroomDetails;

            setClassRoom(res.data.classroomDetails);

            const start = parseTime(startTime);
            const end = parseTime(endTime);
            setRemainingTime(getTimeDifference(start, end));
        }
    };

    const handleAddEntry = () => {
        const start = parseTime(newEntry.startTime);
        const end = parseTime(newEntry.endTime);
        const newDuration = getTimeDifference(start, end);
        if (remainingTime >= newDuration) {
            setEntries([...entries, newEntry]);
            setRemainingTime(remainingTime - newDuration);
            setNewEntry({ day: '', subject: '', startTime: '', endTime: '' });
        } else {
            alert('Not enough remaining time for this entry.');
        }
    };

    const handleSubmit=async(e:React.FormEvent):Promise<void>=>{
        const res=await axiosInstance().post(`/timetable?id=${classroomId}`,entries);
        if(res.status==201){
            console.log(entries)
        }
    }

    useEffect(() => {
        getClassRoom();
    }, [classroomId]);

    return (
        <div className='flex flex-col max-w-xl justify-center m-auto py-4 border border-grey-100 rounded-md px-4 mt-3'>
            <div className='text-xl font-bold'>
                Create Time Table for Classroom: {classroom.name}
            </div>

            <div className='text-slate-700 text-sm py-4'>
                Start Time: {classroom.startTime} and End Time: {classroom.endTime}
            </div>

            <div className='text-slate-700 text-sm py-4'>
                Remaining Time: {Math.floor(remainingTime / 60)} hours {remainingTime % 60} minutes
            </div>

            <div className='py-4'>
                <div className='mb-4'>
                    <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Day"
                        value={newEntry.day}
                        onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
                        className='mb-2'
                    />
                    <Input
                        placeholder="Subject"
                        value={newEntry.subject}
                        onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                        className='mb-2'
                    />
                    <Input
                        placeholder="Start Time (e.g., 8:00AM)"
                        value={newEntry.startTime}
                        onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                        className='mb-2'
                    />
                    <Input
                        placeholder="End Time (e.g., 10:00AM)"
                        value={newEntry.endTime}
                        onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                        className='mb-2'
                    />
                    <Button onClick={handleAddEntry} disabled={remainingTime <= 0}>Add Entry</Button>
                    </form>
                </div>

                <Table className="w-full">
    <TableHead>
        <TableRow>
            <TableCell className="text-left p-2">Day</TableCell>
            <TableCell className="text-left p-2">Subject</TableCell>
            <TableCell className="text-left p-2">Start Time</TableCell>
            <TableCell className="text-left p-2">End Time</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {entries.map((entry, index) => (
            <TableRow key={index}>
                <TableCell className="text-left p-2">{entry.day}</TableCell>
                <TableCell className="text-left p-2">{entry.subject}</TableCell>
                <TableCell className="text-left p-2">{entry.startTime}</TableCell>
                <TableCell className="text-left p-2">{entry.endTime}</TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>

            </div>
        </div>
    );
}

export default Page;
