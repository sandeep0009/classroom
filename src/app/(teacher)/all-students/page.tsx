'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import CustomPagination from '@/components/Pagination'

import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'

interface StudentDetails {
  _id: string;
  name:string;
  email: string;
  password: string;
}

const Page = () => {
  const { data: session } = useSession();
  const classroomId = session?.user?.classroomId; 
  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentDetails | null>(null);
  const [currentPage,setCurrentPage]=useState<number>(1);
  const [totalPage,setTotalPage]=useState<number>(1);
  const limit=5;
  const [searchQuery,setSearchQuery]=useState<string>('')


  const getAllStudents = useCallback(async (page:number,query:string=''): Promise<void> => {
   
    if (classroomId) {
      const res = await axiosInstance().get(`/api/students?id=${classroomId}`,{params:{page,limit,search:query}});
      setTotalPage(res.data.pagination.totalPages)
      setStudents(res.data.data);
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
      getAllStudents(currentPage);
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
        getAllStudents(currentPage);
        handleModalClose();
      }
    }
  }

  const handlePageChange=(page:number)=>{
    setCurrentPage(page)
   
  }
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  useEffect(() => { getAllStudents(currentPage,searchQuery) },[getAllStudents,currentPage,searchQuery]);

  return (
    <div className='flex flex-col m-auto justify-center max-w-2xl py-4'>
      <div className='mb-4 flex justify-between m-auto space-x-5'>
        <div className='text-2xl font-bold text-left'>
          Students in Your Class
        </div>
        <div className='w-96'>
          <Input
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder='Search for your student e.g name or email'/>
        </div>
      </div>

      <div className='mb-4'>
        <Table className='border border-grey-100 rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
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

      <div>
        <CustomPagination totalPage={totalPage} currentPage={currentPage} onPageChange={handlePageChange}/>
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
              <div className='mb-4'>
                <label>Name:</label>
                <input
                  type="name"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
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
