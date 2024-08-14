'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { axiosInstance } from '@/lib/axiosInstance'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface StudentDetails {
  _id: string
  email: string;
  password: string;
}

const Page = () => {
  const { data: session } = useSession();
  const classroomId = session?.user?.classroomId; 

  console.log(session?.user)

  console.log(session?.user?.classroomId)

  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentDetails | null>(null);

  const getAllStudents = useCallback(async (): Promise<void> => {
   
    if (classroomId) {
      const res = await axiosInstance().get(`/api/students?id=${classroomId}`);
      console.log(res)
      setStudents(res.data.allStudents);
    }
  },[classroomId])

  const updateStudent = async (id: string): Promise<void> => {
    const student = students.find((student) => student._id === id);
    if (student) {
      setCurrentStudent(student);
      setModal(true);
    }
  }

  const deleteStudent = async (id: string): Promise<void> => {
    const res = await axiosInstance().delete(`/api/students?id=${id}`);
    if (res.status === 200) {
      getAllStudents();
    }
  }

  const handleModalClose = () => {
    setModal(false);
    setCurrentStudent(null);
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent) {
      const res = await axiosInstance().patch(`/api/students?id=${currentStudent._id}`, currentStudent);
      if (res.status === 200) {
        getAllStudents();
        handleModalClose();
      }
    }
  }

  useEffect(() => { getAllStudents() },[getAllStudents]);

  return (
    <div className='flex flex-col m-auto justify-center max-w-2xl py-4'>
      <div className='mb-4'>
        <div className='text-2xl font-bold text-left'>
          Students in Your Classroom
        </div>
      </div>

      <div className='mb-4'>
        <Table className='border border-grey-100 rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => updateStudent(student._id)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => deleteStudent(student._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modal && currentStudent && (
        <Dialog open={modal} onOpenChange={handleModalClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Modify the details of the selected student.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit}>
              <div className='mb-4'>
                <label>Email:</label>
                <input
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                  className="w-full border p-2"
                />
              </div>
              <div className='flex justify-end'>
                <Button type="submit">Update</Button>
                <Button variant="destructive" onClick={handleModalClose} className="ml-2">Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Page;
