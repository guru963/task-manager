import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar.tsx'
import Sidebar from '../Workspace/Sidebar.tsx'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import Createtasks from './Createtasks.tsx'
import TaskPerProjectDisplay from '../Tasks/TaskPerProjectDisplay.tsx'

const ProjectCard = () => {
  interface Project {
    pname: string,
    _id: string
  }

  const [project, setProject] = useState<Project>()
  const { id } = useParams<{ id: string }>()  // 🟢 Extract 'id' from the URL
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/project/${id}`, {
        withCredentials: true
      })
      const projectData = response.data.data
      console.log(projectData)
      setProject(projectData)
    } catch (error) {
      console.error("Error fetching project:", error)
    }
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  return (
    <div className='h-screen w-full bg-slate-50 flex flex-col'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='w-full m-7 '>
          <div className='flex justify-between'>
            <h1 className='text-black font-bold text-[20px]'>Project Details</h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-blue-700 hover:bg-blue-500' onClick={() => setIsDialogOpen(true)}>
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                {project && <Createtasks projectid={project._id} onSuccess={() => {
                  setIsDialogOpen(false);  
                }} />}
              </DialogContent>
            </Dialog>


          </div>
          {project ? (
            <div className='flex gap-4 items-center m-4'>
              <Button className='bg-blue-700 hover:bg-blue-700'>{project.pname[0].toUpperCase()}</Button>
              <p className='font-bold'>{project.pname}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
           {project&&<TaskPerProjectDisplay projectid={project._id} />}
        </div>

      </div>

    </div>
  )
}

export default ProjectCard
