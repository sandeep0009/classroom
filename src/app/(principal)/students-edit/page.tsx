"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { axiosInstance } from '@/lib/axiosInstance'

interface StudentDetail {
  _id: string;
  email: string;
  password: string;
}

const Page = () => {
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentDetail | null>(null);

  const getStudents = async (): Promise<void> => {
    const res = await axiosInstance().get('/get-all-students');
    console.log(res.data)
    setStudents(res.data.getAllStudents);
  }

  const handleCreateStudent = () => {
    window.location.href = '/create-student';
  }

  const updateStudent = async (id: string): Promise<void> => {
    const studentToUpdate = students.find(student => student._id === id);
    if (studentToUpdate) {
      setCurrentStudent(studentToUpdate);
      setModal(true);
    }
  }

  const handleModalClose = () => {
    setModal(false);
    setCurrentStudent(null);
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent) {
      const res = await axiosInstance().patch(`/students?id=${currentStudent._id}`, currentStudent);
      if (res.status === 200) {
        getStudents();
        handleModalClose();
      }
    }
  }

  const deleteStudent = async (id: string): Promise<void> => {
    const res = await axiosInstance().delete(`/students?id=${id}`);
    if (res.status === 200) {
      getStudents();
    }
  }

  useEffect(() => {
    getStudents();
  }, [])

  return (
    <div className='flex flex-col max-w-xl m-auto justify-center py-4'>
      <div className='flex justify-end'>
        <Button onClick={handleCreateStudent}>Create Student</Button>
      </div>
      <div className='border border-grey-100 rounded-md px-6 py-6 mt-4'>
        <div className='text-xl font-bold mb-4'>
          List of Students
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
    </div>
  )
}

export default Page
