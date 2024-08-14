import React from 'react'
import Link from 'next/link'
import { FaLinkedin, FaGithubSquare, FaFileAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='w-full bg-gray-100 border-t border-grey-600 py-6 '>
      <div className='max-w-6xl mx-auto px-4'>
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            ClassRoom
          </div>
          <div className="flex flex-wrap lg:space-x-4 items-center">
            <Link href="https://www.linkedin.com/in/sandeep-kumar-shah-915a34255/" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FaLinkedin className="mr-1 rounded-lg" size={25} />
            </Link>
            <Link href="https://github.com/sandeep0009" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FaGithubSquare className="mr-1 rounded-lg" size={25}  /> 
            </Link>
            <Link href="https://docs.google.com/document/d/1rUxmjbk0-8CRRT_oXDSOU_GmQ8fhv57hkspYCk9JWx8/edit?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FaFileAlt className="mr-1 rounded-lg" size={25} /> 
            </Link>
            
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} ClassRoom. All rights reserved.Create by Sandeep 
        </div>
      </div>
    </footer>
  )
}

export default Footer