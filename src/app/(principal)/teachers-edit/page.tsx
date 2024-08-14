"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { axiosInstance } from '@/lib/axiosInstance'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Teacher {
  _id: string;
  email: string;
  password: string;
}

const Page = () => {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);  
  const [modal, setModal] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast()


  const addTeacher=()=>{
    window.location.href = '/create-teacher';

  }

  const getAllTeachers =useCallback (async (): Promise<void> => {

    const res = await axiosInstance().get('/api/teachers');
   
    setAllTeachers(res.data.getAllTeachers);
  },[])

  const updateTeacher = async (id: string): Promise<void> => {
    const teacher = allTeachers.find((teacher) => teacher._id === id);
    if (teacher) {
      setCurrentTeacher(teacher);
      setModal(true);
    }
  }

  const deleteTeacher = async (id: string): Promise<void> => {
    const res = await axiosInstance().delete(`/api/teachers?id=${id}`);
    if (res.status === 200) {
      toast({
        description:'student deleted successfully'
      })
      getAllTeachers();
    }
  }

  const handleModalClose = () => {
    setModal(false);
    setCurrentTeacher(null);
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeacher) {
      const res = await axiosInstance().patch(`/api/teachers?id=${currentTeacher._id}`, currentTeacher);
      if (res.status === 200) {
        getAllTeachers();
        handleModalClose();
      }
    }
  }

  useEffect(() => { getAllTeachers() }, [getAllTeachers]);

  return (
    <div className='flex flex-col m-auto justify-center max-w-2xl py-4 '>
      <div className='flex justify-end'>
        <Button onClick={addTeacher}>Add Teacher</Button>
      </div>
      <div className="mb-4">
        <div className='text-2xl font-bold text-left'>
          All Teachers
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
            {allTeachers.map((teacher, index) => (
              <TableRow key={teacher._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => updateTeacher(teacher._id)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => deleteTeacher(teacher._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modal && currentTeacher && (
        <Dialog open={modal} onOpenChange={handleModalClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>
                Modify the details of the selected teacher.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit}>
              <div className='mb-4'>
                <label>Email:</label>
                <input
                  type="email"
                  value={currentTeacher.email}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                  className="w-full border p-2"
                />
              </div>
              <div className='flex justify-end'>
                <Button  type="submit">Update</Button>
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
