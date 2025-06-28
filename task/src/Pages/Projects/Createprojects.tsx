import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { useWorkspace } from '../../context/WorkspaceContext'

const Createprojects = () => {

  interface Formdata {
    pname: string,
  }
  const [formdata, setformdata] = useState<Formdata>({
    pname: "",
  })

  const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
    setformdata(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }
  const { selectedWorkspace } = useWorkspace()
  const handlesubmit = async(e: FormEvent) => {
    e.preventDefault()
    if (!selectedWorkspace) {
    toast.error("Please select a workspace before creating a project")
    return
  }

  const dataToSend = {
    pname: formdata.pname,
    workspaceId: selectedWorkspace._id
  }

    try {
      const res=await axios.post("http://localhost:3000/project/create-project",dataToSend,
        {
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        }
      )
      console.log(res.data)
      toast.success("Project Created Successfully")
      setformdata(prev=>({
        ...prev,
        pname:""
      }))
    } catch (error) {
      console.log("Error")
      toast.error("Error in Creation of Project")
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className='bg-blue-600 text-white font-extrabold text-[16px]'>+</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handlesubmit}>
            <div className='w-full'>
              <Card className='w-full border-2 border-blue-600 border-dashed'>
                <CardHeader>
                  <CardTitle className='font-bold text-[16px]'>Create Projects</CardTitle>
                  <CardDescription>Create your project and progress it in your own workspace</CardDescription>
                  <CardAction>
                    <Button className='bg-blue-600 text-white hover:bg-blue-400'>Create</Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col gap-2 items-start'>
                    <p className='font-bold text-[16px]'>Project Name</p>
                    <Input id="pname" type="text" placeholder='Project Name' onChange={handlechange} value={formdata.pname} className='border-2 border-blue-600 border-dashed'></Input>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Createprojects