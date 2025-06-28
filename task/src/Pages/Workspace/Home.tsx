import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Sidebar from './Sidebar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoTriangleDown } from "react-icons/go";
import { Button } from '@/components/ui/button'
import { FaArrowDown, FaArrowUp, FaCalendarAlt, FaEquals, FaExclamationCircle } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useWorkspace } from '@/context/WorkspaceContext'
const HomePage = () => {
  interface TeamMember {
    name: string;
    email: string;
  }

  interface Workspace {
    _id: string;
    picture: string;
    teammembers: TeamMember[];
  }

  interface Project {
    _id: string;
    pname: string;
    workspaceId: Workspace;
  }
  interface Task {
    _id: string;
    Datecomplete: Date;
    description: string;
    tname: string;
    status: string;
    priority: string;
    projectid: Project
  }

  const { selectedWorkspace, workspaces } = useWorkspace()
  console.log(selectedWorkspace)
  console.log(workspaces)
  const [projects, setProjects] = useState<Project[]>([])
  const [task, settasks] = useState<Task[]>([])

  const assignedTasks = task.filter(t => t.status !== "Completed");

  const completedTasks = task.filter(t => t.status === "Completed");


  const now = new Date();
  const overdueTasks = task.filter(t => {
    const due = new Date(t.Datecomplete);
    return (t.status === "OverDue") || (due < now);
  });


  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (selectedWorkspace) {
        try {

          const response2 = await axios.get(`http://localhost:3000/project/all-projects?workspaceId=${selectedWorkspace._id}`, {
            withCredentials: true
          })
          const response3 = await axios.get(`http://localhost:3000/task/every-tasks?workspaceId=${selectedWorkspace._id}`, {
            withCredentials: true
          })

          const projects = response2.data.data

          console.log(response2.data.data)
          console.log(response3.data.tasks)
          setProjects(projects)
          settasks(response3.data.tasks)
        } catch (error) {
          console.error("Error fetching workspaces:", error)
        }
      }
    }

    fetchWorkspaces()
  })
  return (
    <div className='h-screen w-full bg-slate-50 flex flex-col'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='w-full m-4'>
          <Card className='border-3 border-blue-700 border-dashed p-0.5'>
            <CardHeader className='pt-0 mt-0'>
              <CardTitle className='text-[17px]  font-bold'>Home Page</CardTitle>
              <CardDescription>Manage and View your tasks.</CardDescription>

            </CardHeader>
            <CardContent>
              <div className='flex justify-around items-center'>
                <div className=''>
                  <p className='text-zinc-600 text-[16px] space-x-0.5 flex items-center justify-center '>Total Projects
                    <span className='text-2xl text-blue-600'><GoTriangleDown /></span>
                    <span className=' text-blue-600'>{projects.length}</span>
                  </p>
                  <p className='text-black text-3xl font-bold'>{projects.length}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-600 text-[16px] space-x-0.5 flex items-center justify-center">Total Tasks
                    <span className='text-2xl text-blue-600'><GoTriangleDown /></span>
                    <span className=' text-blue-600'>{task.length}</span>
                  </p>

                  <p className='text-black text-3xl font-bold'>{task.length}
                  </p>
                </div>
                <div>
                  <p className='text-zinc-600 text-[16px] space-x-0.5 flex items-center justify-center '>Assigned Tasks
                    <span className='text-2xl text-blue-600'><GoTriangleDown /></span>
                    <span className=' text-blue-600'>{assignedTasks.length}</span>
                  </p>
                  <p className='text-black text-3xl font-bold'>{assignedTasks.length}
                  </p>
                </div>
                <div>
                  <p className='text-zinc-600 text-[16px] space-x-0.5 flex items-center justify-center '>Completed Tasks
                    <span className='text-2xl text-green-700'><GoTriangleDown /></span>
                    <span className=' text-green-400'>{completedTasks.length}</span>
                  </p>
                  <p className='text-black text-3xl font-bold'>{completedTasks.length}
                  </p>
                </div>
                <div>
                  <p className='text-zinc-600 text-[16px] space-x-0.5  flex items-center justify-center'>Overdue Tasks
                    <span className='text-2xl text-red-600'><GoTriangleDown /></span>
                    <span className=' text-red-400'>{overdueTasks.length}</span>
                  </p>
                  <p className='text-black text-3xl font-bold'>{overdueTasks.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className='flex'>
            <div className='m-3 w-6/5'>
              <Card className='bg-zinc-100'>
                <CardHeader className='flex justify-between items-center'>
                  <CardTitle className='text-black text-[16px] font-bold'>Assigned Tasks</CardTitle>

                  <CardAction>
                    <Button className='text-black text-[16px] font-bold rounded-t rounded-b bg-white hover:bg-blue-500 hover:text-white' variant="ghost">+</Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  {
                    task.length == 0 ? <div><p className='justify-center items-center text-[15px] text-zinc-700'>No tasks Created yet</p></div> : <></>
                  }
                  <div className="flex flex-col gap-3">
                    {task.slice(0, 3).map((t, index) => {
                      const projectLetter = t.projectid?.pname?.[0]?.toUpperCase() || "?";
                      const dueDate = t.Datecomplete ? new Date(t.Datecomplete).toLocaleDateString('en-GB') : "No date";

                      const priorityColors: Record<string, string> = {
                        Urgent: "bg-red-500 text-white",
                        High: "bg-orange-500 text-white",
                        Medium: "bg-yellow-400 text-black",
                        Low: "bg-green-400 text-black"
                      };

                      const progressColors: Record<string, string> = {
                        NewTask: "bg-gray-400 text-white",
                        Inprogress: "bg-blue-400 text-white",
                        Review: "bg-orange-400 text-white",
                        Completed: "bg-green-500 text-white",
                        OverDue: "bg-red-400 text-white"
                      };

                      return (
                        <Button key={index} variant="ghost" className="w-full h-auto bg-white flex flex-col items-start text-left p-2 hover:bg-zinc-200">
                          <div className="w-full grid grid-cols-12  items-center">
                            {/* Project Letter */}
                            <div className="col-span-1">
                              <Button variant="ghost" className="bg-blue-600 hover:bg-blue-400 text-white font-bold w-8 h-8 p-0 rounded-full flex items-center justify-center">
                                {projectLetter}
                              </Button>
                            </div>

                            {/* Task Name and Priority */}
                            <div className="col-span-2">
                              <p className="text-black font-medium text-[14px] truncate">{t.tname}</p>

                            </div>

                            {/* Progress Status */}
                            <div className='col-span-3'>
                              {t.priority && (
                                <div className={`${priorityColors[t.priority]} text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1`}>
                                  {t.priority === "Urgent" && <FaExclamationCircle size={10} />}
                                  {t.priority === "High" && <FaArrowUp size={10} />}
                                  {t.priority === "Medium" && <FaEquals size={10} />}
                                  {t.priority === "Low" && <FaArrowDown size={10} />}
                                  {t.priority}
                                </div>
                              )}
                            </div>
                            <div className="col-span-3">
                              {t.status && (
                                <div className={`${progressColors[t.status]} text-xs px-2 py-0.5 rounded-full text-center`}>
                                  {t.status.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                              )}
                            </div>


                            {/* Due Date */}
                            <div className="col-span-3 flex items-center justify-end gap-1">
                              <FaCalendarAlt className="text-zinc-500 text-xs" />
                              <span className="text-zinc-600 text-[12px]">{dueDate}</span>
                            </div>
                          </div>

                          {/* Description */}
                          {t.description && (
                            <p className="text-zinc-600 text-[12px] mt-2 line-clamp-2">
                              {t.description}
                            </p>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>



                <CardFooter>
                  <Button className='w-full'>Show All</Button>
                </CardFooter>
              </Card>
            </div>
            <div className='w-full m-3'>
              <Card className='bg-zinc-100'>
                <CardHeader>
                  <CardTitle className='text-black text-[16px] font-bold'>Projects</CardTitle>
                  <CardDescription>View your Project groups</CardDescription>
                </CardHeader>
                <CardContent>
                  {
                    projects.length == 0 ? <div><p className='justify-center items-center text-[15px] text-zinc-700'>No Projects Created yet</p></div> : <></>
                  }
                  <div className='flex flex-wrap gap-3'>
                    {projects.slice(0, 3).map((project) => (
                      <div className='flex gap-2 items-center'>
                        <Button className='bg-blue-600 text-white font-bold rounded hover:bg-blue-600'>{project.pname[0].toUpperCase()}</Button>
                        <p className='text-[16px] font-bold'>{project.pname}</p>
                      </div>
                    ))




                    }
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Show All</Button>
                </CardFooter>
              </Card>
              <div className='w-full m-3'>
                <Card className='bg-zinc-100'>
                  <CardHeader>
                    <CardTitle className='text-black text-[16px] font-bold'>Members</CardTitle>
                    <CardAction>
                      <Button variant="ghost" className='bg-white text-black hover:bg-zinc-200 hover:text-black'>
                        <IoIosSettings />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    {
                      projects.length == 0 ? <div><p className='justify-center items-center text-[15px] text-zinc-700'>No Members are invited yet</p></div> : <></>
                    }
                    <div className='flex gap-3 flex-wrap items-center justify-around'>
                      {projects[0]?.workspaceId?.teammembers.slice(0, 3).map((member, index) => (
                        <div key={index} className='flex items-center gap-4'>
                          <IoMdPerson />
                          <p className='text-[14px] font-bold'>{member.name}</p>
                        </div>
                      ))}
                    </div>

                  </CardContent>
                  <CardFooter>
                    <Button className='w-full'>Show All</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default HomePage