"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useState,useMemo } from 'react'
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
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import CustomPagination from '@/components/Pagination'
import { debounce } from 'lodash'
import { Input } from '@/components/ui/input'

interface StudentDetail {
  _id: string;
  name: string;
  email: string;
  password: string;
}

const Page = () => {
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentDetail | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const limit = 5
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getStudents = useCallback(async (page: number, query: string = ''): Promise<void> => {
    try {
      const res = await axiosInstance().get('/api/get-all-students', { params: { page, limit, search: query } });
      setTotalPage(res.data.pagination.totalPages)
      setStudents(res.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch students. Please try again.",
      });
    }
  }, [limit, toast])

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
      try {
        const res = await axiosInstance().patch(`/api/students?id=${currentStudent._id}`, currentStudent);
        if (res.status === 200) {
          getStudents(currentPage);
          handleModalClose();
          toast({
            description: 'Student updated successfully'
          });
        }
      } catch (error) {
        console.error("Error updating student:", error);
        toast({
          variant: "destructive",
          description: "Failed to update student. Please try again.",
        });
      }
    }
  }

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      const res = await axiosInstance().delete(`/api/students?id=${id}`);
      if (res.status === 200) {
        toast({
          description: 'Student deleted successfully'
        })
        getStudents(currentPage);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete student. Please try again.",
      });
    }
  }


  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );
  useEffect(() => {
    getStudents(currentPage,searchQuery);
  }, [getStudents, currentPage, searchQuery])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col max-w-xl m-auto justify-center py-4'>
      <div className='flex justify-between mb-4'>

        <div className='w-96'>

          <Input
            
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder='Search for student by name or email' />
        </div>

        <div>
          <Button onClick={handleCreateStudent}>Create Student</Button>
        </div>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
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
          <CustomPagination totalPage={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
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
                    type="text"
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
    </div>
  )
}

export default Page