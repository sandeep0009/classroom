"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useRouter } from 'next/navigation'
import CustomPagination from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import {debounce} from "lodash";

interface Teacher {
  _id: string;
  name:string;
  email: string;
  password: string;
}
const Page = () => {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const limit = 5;

  const [searchQuery,setSearchQuery]=useState<string>('');
  

  const { toast } = useToast();
  
  const addTeacher = () => {
    window.location.href = '/create-teacher';
  };

  const getAllTeachers = useCallback(async (page: number,query:string=''): Promise<void> => {
    try {
      const res = await axiosInstance().get('/api/teachers', { params: { limit, page,search:query } });      
      setAllTeachers(res.data.data);
      setTotalPage(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch teachers. Please try again.",
      });
    }
  }, [limit, toast]);

  const updateTeacher = async (id: string): Promise<void> => {
    const teacher = allTeachers.find((teacher) => teacher._id === id);
    if (teacher) {
      setCurrentTeacher(teacher);
      setModal(true);
    }
  };

  const deleteTeacher = async (id: string): Promise<void> => {
    try {
      const res = await axiosInstance().delete(`/api/teachers?id=${id}`);
      if (res.status === 200) {
        toast({
          description: 'Teacher deleted successfully',
        });
        getAllTeachers(currentPage);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete teacher. Please try again.",
      });
    }
  };

  const handleModalClose = () => {
    setModal(false);
    setCurrentTeacher(null);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeacher) {
      try {
        const res = await axiosInstance().patch(`/api/teachers?id=${currentTeacher._id}`, currentTeacher);
        if (res.status === 200) {
          getAllTeachers(currentPage);
          handleModalClose();
          toast({
            description: 'Teacher updated successfully',
          });
        }
      } catch (error) {
        console.error("Error updating teacher:", error);
        toast({
          variant: "destructive",
          description: "Failed to update teacher. Please try again.",
        });
      }
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  

  useEffect(() => {
    getAllTeachers(currentPage,searchQuery);
  }, [currentPage, getAllTeachers,searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col m-auto justify-center max-w-2xl py-4'>
      <div className='flex justify-between mb-4'>

        <div className='w-96'>
          
        <Input
        value={searchQuery}
        onChange={(e) => debouncedSearch(e.target.value)}      
        placeholder='Search for teacher by name or email'/>
        </div>

        <div>

        <Button onClick={addTeacher}>Add Teacher</Button>
        </div>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allTeachers.length === 0
              ? <TableRow><TableCell colSpan={4}>No data available</TableCell></TableRow>
              : allTeachers.map((teacher, index) => (
                <TableRow key={teacher._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
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

      <div className="mb-4">
        <CustomPagination
          totalPage={totalPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
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
              <div className='mb-4'>
                <label>Name:</label>
                <input
                  type="text"
                  value={currentTeacher.name}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
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
  );
};

export default Page;