"use client"
import { axiosInstance } from '@/lib/axiosInstance'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  name: string;
  email: string;
 
}

const Page = () => {
  const { data: session } = useSession();
  const classRoomId = session?.user?.classroomId;
  const [students, setStudents] = useState<Student[]>([]);

  const fetchAllStudents = async (): Promise<void> => {
    if (classRoomId) {
      const res = await axiosInstance().get(`/students?id=${classRoomId}`);
      setStudents(res.data.allStudents); 
    }
  }

  useEffect(() => {
    fetchAllStudents();
  });

  return (
    <div className='flex flex-col m-auto max-w-xl justify-center  border border-grey-100 px-4 py-4 rounded-md mt-4'>
      <div className='text-xl font-bold mb-4'>
        All Students in the Class
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Email</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={index}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{student.email}</TableCell>
         
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Page
