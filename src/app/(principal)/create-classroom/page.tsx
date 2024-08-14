"use client"

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/axiosInstance'
import { useToast } from "@/components/ui/use-toast"

interface FormData {
    name: string;
    startTime: string;
    endTime: string;
    daysInSession: string;
    teacherId: string;
    studentIds: string[];
}

interface Teacher {
    id: string;
    email: string;
}
interface Student {
    id: string;
    email: string;
}

const Page = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        startTime: "",
        endTime: "",
        daysInSession: "",
        teacherId: "",
        studentIds: []
    });
    const { toast } = useToast()

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const[students,setStudents]=useState<Student[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const getTeachers = async (): Promise<void> => {
        try {
            const res = await axiosInstance().get('/api/teachers');
            setTeachers(res.data.getAllTeachers.map((teacher: any) => ({
                id: teacher._id,
                email: teacher.email
            })));
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    }

    const getStudents=async():Promise<void>=>{
       const res= await axiosInstance().get('/api/get-all-students');
       setStudents(res.data.getAllStudents.map((student: any) => ({
        id: student._id,
        email: student.email
    })));

    }

    const handleCreateClassRoom = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
           
            const response = await axiosInstance().post('/api/classroom', formData);
           if(response.status==201){
            toast({
                description:'new Classroom created successfully'
            })
           }
            
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    }

    useEffect(() => {
        getTeachers();
        getStudents()
    }, [])

    return (
        <div className='flex flex-col m-auto justify-center max-w-2xl py-4'>
            <div className="py-4">
                <div className='text-center mb-4 text-2xl font-bold'>
                    Create ClassRoom
                </div>
                <form onSubmit={handleCreateClassRoom}>
                    <div className="mb-4">
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='enter the class name'
                            className='outline-none'
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            placeholder='enter the start timing'
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            placeholder='enter the end timing'
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="daysInSession"
                            value={formData.daysInSession}
                            onChange={handleChange}
                            placeholder='enter the number of days'
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="" className='px-4'>Select Teacher</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {selectedTeacher || "Choose teacher"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Teachers</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {teachers.map((teacher) => (
                                    <DropdownMenuItem
                                        key={teacher.id}
                                        onSelect={() => {
                                            setSelectedTeacher(teacher.email);
                                            setFormData({ ...formData, teacherId: teacher.id });
                                        }}
                                    >
                                        {teacher.email}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="" className='px-4'>Select Students</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {formData.studentIds.length > 0 ? `${formData.studentIds.length} student(s) selected` : "Choose students"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Students</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {students.map((student) => (
                                    <DropdownMenuItem
                                        key={student.id}
                                        onSelect={() => {
                                            if (formData.studentIds.includes(student.id)) {
                                                setFormData({
                                                    ...formData,
                                                    studentIds: formData.studentIds.filter(id => id !== student.id)
                                                });
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    studentIds: [...formData.studentIds, student.id]
                                                });
                                            }
                                        }}
                                    >
                                        {student.email} {formData.studentIds.includes(student.id) && "(selected)"}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-4 flex justify-center w-full">
                        <Button type="submit" className='w-full'>Create ClassRoom</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Page