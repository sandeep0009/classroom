"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { signIn } from "next-auth/react";

interface FormInterface {
  email: string,
  password: string
}

const Page = () => {
  const [formData, setFormData] = useState<FormInterface>({
    email: "",
    password: ""
  })

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    console.log(result)
    if (result?.error) {
      console.log(result.error);
    }
  }

  return (
    <div className="flex items-center justify-center  bg-gray-100 p-11">
      <div className="w-96 max-w-xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login to ClassRoom
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Input
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChanges}
              className="w-full"
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChanges}
              className="w-full"
            />
          </div>
          <div>
            <Button type="submit" className="w-full">Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page