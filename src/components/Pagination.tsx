import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationDetails {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void
}

const CustomPagination = ({ currentPage, totalPage, onPageChange }: PaginationDetails) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) {
            onPageChange(page)
        }
    }

    const pages = []
    for (let i = 1; i <= totalPage; i++) {
        pages.push(
            <PaginationItem key={i} className='max-1'>
                <PaginationLink
                    href='#'
                    onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(i)
                    }}
                    className={`bg-black text-white w-10 h-10 flex items-center justify-center ${currentPage === i ? 'font-bold' : ''}`}
                >
                    {i}
                </PaginationLink>
            </PaginationItem>
        )
    }

    return (
        <div className='flex justify-center items-center'>
            <Pagination>
                <PaginationContent className='space-x-2 flex items-center'>
                    <PaginationItem className="mr-auto">
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(currentPage - 1)
                            }}
                            className="bg-black text-white w-20 h-10 flex items-center justify-center"
                           
                        />
                    </PaginationItem>

                    {pages}

                    <PaginationItem className="ml-auto">
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(currentPage + 1)
                            }}
                            className="bg-black text-white w-20 h-10 flex items-center justify-center"
                           
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default CustomPagination