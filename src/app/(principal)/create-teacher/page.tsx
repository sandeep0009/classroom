"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { axiosInstance } from '@/lib/axiosInstance';
import React, {useState} from 'react'


interface TeacherDetail{
    email:string;
    password:string;
}
const Page = () => {
    const[formData,setFormData]=useState<TeacherDetail>({
        email:'',
        password:''

    })

    const previousPage=()=>{
        window.location.href='/teachers-edit'
    }

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }

    const handleFormData=async(e:React.FormEvent):Promise<void>=>{
        e.preventDefault();
        const res=await axiosInstance().post('/teachers',formData);

        if(res.status==201){
            console.log(formData)
        }
    }
  return (
    <div className='flex flex-col m-auto justify-center bg-grey-100 max-w-xl py-6'>
        <div className='flex justify-end mb-2'>
            <Button onClick={previousPage}>Back</Button>
        </div>

        <div className='border border-grey-100 px-4 py-4 mt-2 rounded-md'>
        <div className='text-xl font-bold mb-4'>
            Create New Teacher
        </div>

        <form onSubmit={handleFormData}>

        <div className="mb-3">
            <Input 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='enter the mail of new Teacher'/>
        </div>
        <div className="mb-3">
            <Input
            type='password'
            name="password"
            value={formData.password}
            onChange={handleChange}
             placeholder='enter the password of new Teacher'/>
        </div>

        <div className="mb-6 mt-6 flex justify-center">
            <Button className='w-full'>Create Teacher</Button>
        </div>
        </form>
        </div>
    </div>
  )
}

export default Page