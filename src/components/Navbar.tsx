"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'


interface NavItem {
  name: string;
  link: string;
}
const Navbar:React.FC = () => {

  const {data:session}=useSession()

  const principal : NavItem[]=[
    {
      name:"Create Classroom",
      link:'/create-classroom'
    },
    {
      name:'Settings',
      link:'/settings'
    },
    {
      name:'All time Table',
      link:'/all-time-table'
    }
  ]



  const student:NavItem[]=[
    {
      name:'Time Table',
      link:'/time-table'

    },
    {
      name:'All Students',
      link:'/all-students'
    }
  ]


  const teacher:NavItem[]=[
    {
      name:'Create time table',
      link:'/create-time-table'
    },
    {
      name:'All Students',
      link:'/all-students'
    }
  ]

  let navItems:NavItem[]=[]

  if (session?.user?.role === 'principal') {
    navItems = principal;
  } else if (session?.user?.role === 'teacher') {
    navItems = teacher;
  } else if (session?.user?.role === 'student') {
    navItems = student;
  }



  return (
    <div className='w-full bg-gray-100 border-b border-grey-600 py-6'>
        <div className='max-w-6xl mx-auto px-4 text-2xl font-bold'>
        {navItems.map((item, index) => (
            <Link key={index} href={item.link} className='text-sm px-6   hover:underline'>
              {item.name}
            </Link>
          ))}
        </div>
    </div>
  )
}

export default Navbar