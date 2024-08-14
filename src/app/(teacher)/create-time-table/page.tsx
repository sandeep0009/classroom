"use client";
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
            try {
                const res = await axiosInstance().get(`/classroom?id=${classroomId}`);
                const { startTime, endTime } = res.data.classroomDetails;

                setClassRoom(res.data.classroomDetails);

                const start = parseTime(startTime);
                const end = parseTime(endTime);
                setRemainingTime(getTimeDifference(start, end));
            } catch (error) {
                console.error("Failed to fetch classroom details:", error);
            }
        }
    };

    const handleAddEntry = () => {
        const start = parseTime(newEntry.startTime);
        const end = parseTime(newEntry.endTime);
        const newDuration = getTimeDifference(start, end);

        if (remainingTime >= newDuration) {
            setEntries(prevEntries => [...prevEntries, newEntry]);
            setRemainingTime(remainingTime - newDuration);
            setNewEntry({ day: '', subject: '', startTime: '', endTime: '' });
        } else {
            alert('Not enough remaining time for this entry.');
        }
    };

    const handleSubmit = async (): Promise<void> => {
        if (classroomId) {
            console.log("Submitting the following entries:", entries);
            try {
                const res = await axiosInstance().post(`/timetable?id=${classroomId}`, { entries });
                if (res.status === 201) {
                  
                    setEntries([]);
                }
            } catch (error) {
                console.error("Failed to submit timetable:", error);
            }
        }
    };

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
                    <Button type="button" onClick={handleAddEntry} disabled={remainingTime <= 0}>Add Entry</Button>
                </div>


                <div className='w-full'>
    <Table className="w-full border-collapse">
        <TableHeader>
            <TableRow>
                <TableHead className="border p-2 font-bold">Day</TableHead>
                <TableHead className="border p-2 font-bold">Subject</TableHead>
                <TableHead className="border p-2 font-bold">Start Time</TableHead>
                <TableHead className="border p-2 font-bold">End Time</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {entries.length > 0 ? (
                entries.map((entry, index) => (
                    <TableRow key={index}>
                        <TableCell className="border p-2">{entry.day}</TableCell>
                        <TableCell className="border p-2">{entry.subject}</TableCell>
                        <TableCell className="border p-2">{entry.startTime}</TableCell>
                        <TableCell className="border p-2">{entry.endTime}</TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center p-2 border">
                        No entries yet
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
</div>
                <Button type="button" onClick={handleSubmit} className='mt-4'>Submit Timetable</Button>
            </div>
        </div>
    );
};

export default Page;
