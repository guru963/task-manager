import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from "sonner"
const Signin = () => {

  interface Formdata{
    name:string,
    email:string,
    password:string
  }
  const navigate=useNavigate()

  const [formdata,setformdata]=useState<Formdata>({
    name:'',
    email:"",
    password:""
  })

  const handlechange=(e: ChangeEvent<HTMLInputElement>)=>{
    setformdata(prev=>({
      ...prev,
      [e.target.id]:e.target.value

    }))
  }

  const handlesubmit=async(e:FormEvent)=>{
    e.preventDefault()

    try {
      const response=await axios.post("http://localhost:3000/auth/register",formdata,
      {
        withCredentials:true,
      
      headers: {
            "Content-Type": "application/json"
          }
        }
      )
      console.log(response.data)
      toast.success("Registered Successfully!!")
      setTimeout(() => navigate('/sign-up'), 100) 
      
    } catch (error) {
      console.log(error)
      toast.error("Invalid Credentials")
      
    }
    
  }
  return (
    <div className='h-screen w-full flex justify-center items-center'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className='font-bold text-[18px] justify-center items-center flex'>Register</CardTitle>
        <CardDescription className='justify-center items-center flex'>
          Register an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <form onSubmit={handlesubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="Name" className='font-bold'>Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="Full Name"
                onChange={handlechange}
                value={formdata.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className='font-bold'>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                 onChange={handlechange}
                 value={formdata.email}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className='font-bold'>Password</Label>
              </div>
              <Input id="password" type="password" placeholder='Password'value={formdata.password}  onChange={handlechange} required />
            </div>
          </div>
        
        <p className='text-sm mt-2 mr-2 ml-[70px] text-blue-700'>Already have an account?<span className='underline cursor-pointer'>Sign Up</span></p>
      <CardFooter className="flex-col gap-3">
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-400">
          Register
        </Button>
        <Button variant="outline" className="w-full border-2 border-black">
          Login with Google
        </Button>
      </CardFooter>
      </form>
      </CardContent>
    </Card>
    </div>
  )
}

export default Signin