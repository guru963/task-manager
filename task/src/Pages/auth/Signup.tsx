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
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from "sonner"
import { useAuth } from '../../context/authcontext.tsx'
import { useLocation } from 'react-router-dom'




const Signup = () => {
  const location = useLocation()
const params = new URLSearchParams(location.search)
const redirectPath = params.get('redirect') || '/home-workspace'
  interface Formdata{
    email:"",
    password:""
  }
  const navigate=useNavigate()
  const [formdata,setformdata]=useState<Formdata>({
    email:"",
    password:""
  })
  const { login } = useAuth()
  const handlechange=(e: ChangeEvent<HTMLInputElement>)=>{
    setformdata(prev=>({
      ...prev,
      [e.target.id]:e.target.value
    }))
  }

  const handlesubmit=async(e:FormEvent)=>{
    e.preventDefault()
    try {
      const response=await axios.post("http://localhost:3000/auth/login",formdata,
        {
          withCredentials:true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      login()
      console.log(response.data)
      toast.success("Logged in Successfully!!")
      const params = new URLSearchParams(window.location.search)
    const redirectPath = params.get('redirect') || '/home-workspace'
      setTimeout(() => navigate(redirectPath), 100)
    } catch (error) {
      console.log(error)
      toast.error("Invalid Credentials")
    }
    
    
  }
  return (
    <div className='h-3/4 w-3/4 flex justify-center items-center'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className='font-bold text-[18px]'>Welcome Back!!</CardTitle>
        <CardDescription>
          Log In to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <form onSubmit={handlesubmit}>
          <div className="flex flex-col gap-6">
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
                <a
                  href="#"
                  className="ml-auto inline-block text-sm text-blue-700 underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" placeholder='Password' onChange={handlechange}
                value={formdata.password} required />
            </div>
          </div>
        
        <p className='text-sm mt-2 mr-2 ml-[70px] text-blue-700'>Don't have an account?<span className='underline cursor-pointer'>
          <Link to="/sign-in">Sign-in</Link>
      </span></p>
      <CardFooter className="flex-col gap-3">
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-400">
          Login
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

export default Signup