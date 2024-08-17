"use client"
import { axiosInstance } from '@/lib/axiosInstance'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState ,useMemo} from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import {debounce} from "lodash";

interface Student {
  name: string;
  email: string;

}

const Page = () => {
  const { data: session } = useSession();
  const classRoomId = session?.user?.classroomId;
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1);
  const limit = 5;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchAllStudents = useCallback(async (page: number, query: string = ''): Promise<void> => {
    if (classRoomId) {
      const res = await axiosInstance().get(`/api/students?id=${classRoomId}`, { params: { limit, page, search: query } });
      setTotalPage(res.data.pagination.totalPages)
      setStudents(res.data.data);
    }
  }, [classRoomId, limit])

  useEffect(() => {
    fetchAllStudents(currentPage);
  }, [fetchAllStudents, currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );


  return (
    <div className='flex flex-col m-auto max-w-xl justify-center  border border-grey-100 px-4 py-4 rounded-md mt-4'>

      <div className='flex justify-between mb-4'>

        <div>
          <div className='text-xl font-bold mb-4'>
            All Students in the Class
          </div>

        </div>
        <div className='w-96'>

          <Input
            value={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder='Search for teacher by name or email' />
        </div>

        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div>
          <CustomPagination totalPage={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      </div>
      )
}

      export default Page
