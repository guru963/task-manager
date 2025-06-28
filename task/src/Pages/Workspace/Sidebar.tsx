import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaTasks } from 'react-icons/fa'
import { IoHomeOutline, IoSettingsOutline, IoPersonAddOutline } from 'react-icons/io5'
import { Menu, Check } from 'lucide-react'
import axios from 'axios'
import Createprojects from '../Projects/Createprojects'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
type Workspace = {
  _id: string
  workspacename: string
  picture: string
  members: []
}

const navItems = [
  { to: '/home-workspace', label: 'Home', icon: <IoHomeOutline /> },
  { to: '/home-workspace/my-tasks', label: 'My Tasks', icon: <FaTasks /> },
  { to: '/home-workspace/members', label: 'Members', icon: <IoPersonAddOutline /> },
]

const Sidebar: React.FC = () => {
  interface Project {
    _id: string,
    pname: string
  }
  const location = useLocation()
  const { selectedWorkspace, setSelectedWorkspace, workspaces } = useWorkspace()
  console.log(selectedWorkspace)
  console.log(workspaces)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if(selectedWorkspace){
        try {
       
        const response2 = await axios.get(`http://localhost:3000/project/all-projects?workspaceId=${selectedWorkspace._id}`, {
          withCredentials: true
        })
      
        const projects = response2.data.data
        console.log(projects)
        setProjects(projects)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      }
      }
    }

    fetchWorkspaces()
})
  const navigate = useNavigate()

  const handleWorkspaceSelect = (ws: Workspace) => {
    setSelectedWorkspace(ws)
     localStorage.setItem("selectedWorkspaceId", ws._id)
    navigate(`/workspace/${ws._id}`) 
  }


  return (
    <div className="md:flex h-full">
      {/* Mobile Sidebar */}
      <div className="md:hidden p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-slate-100 p-4">
            {selectedWorkspace && (
              <WorkspaceSelector
                selected={selectedWorkspace}
                onSelect={setSelectedWorkspace}
                workspaces={workspaces}
              />
            )}
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-2 text-left hover:bg-zinc-300 ${location.pathname === item.to ? 'bg-zinc-200 font-semibold' : ''
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[250px] bg-slate-100 p-4 gap-2">
        <WorkspaceSelector
          selected={selectedWorkspace || { _id: '', workspacename: 'Select a workspace', picture: '', members: [] }}
          onSelect={handleWorkspaceSelect}
          workspaces={workspaces}
        />

        <div className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="w-full">
              <Button
                variant="ghost"
                className={`w-full flex items-center gap-2 text-left hover:bg-zinc-300 ${location.pathname === item.to ? 'bg-zinc-200 font-semibold' : ''
                  }`}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
        <div>

          <div className='flex justify-between items-center mt-6 mb-2 bg-zinc-200 pl-2 pr-2 rounded'>
            <p className='font-bold text-16px'>Projects</p>
            <Createprojects />
          </div>
          <div className='flex flex-col gap-2 flex-wrap'>
            {
              projects.length==0?<div><p className='ml-4'>No Projects created yet</p></div>:<></>
            }
            {
              projects.map((project, key) => (

                <Link to={`/project/${project._id}`}>
                  <Button className='w-full text-left bg-white hover:bg-zinc-100 p-2 '>
                    <div className=' w-full flex gap-2 items-center'>
                      <Button className='bg-blue-700 text-white hover:bg-blue-500 '>{project.pname[0].toUpperCase()}</Button>
                      {project.pname.length < 17 ? <p className='text-black flex flex-wrap'>{project.pname}</p> : <p className='text-black flex flex-wrap'>{project.pname.slice(0, 17)}...</p>}
                    </div>
                  </Button>
                </Link>
              ))
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar

// ----------------- WorkspaceSelector ------------------

type WorkspaceSelectorProps = {
  selected: Workspace
  onSelect: (ws: Workspace) => void
  workspaces: Workspace[]
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  selected,
  onSelect,
  workspaces,
}) => {
  if (workspaces.length === 0) {
    return (
      <div className="w-auto h-auto border-2 border-blue-500 border-dashed flex flex-col gap-2 p-3">
        <div className="flex justify-between items-center">
          <p className="text-[16px] font-bold text-zinc-500">Workspace</p>
          <Link to="/home-workspace/create">
            <Button
              variant="ghost"
              className="bg-blue-700 text-white rounded hover:bg-blue-400"
            >
              +
            </Button>
          </Link>
        </div>
        <p className="text-sm text-center py-2">No workspaces available</p>
      </div>
    )
  }
  return (
    <div className="w-auto h-auto border-2 border-blue-500 border-dashed flex flex-col gap-2 p-3">
      <div className="flex justify-between items-center">
        <p className="text-[16px] font-bold text-zinc-500">Workspace</p>
        <Link to="/home-workspace/create">
          <Button
            variant="ghost"
            className="bg-blue-700  text-white rounded hover:bg-blue-400"
          >
            +
          </Button>
        </Link>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex justify-start w-full">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selected.picture} />
              <AvatarFallback>{selected?.workspacename?.charAt(0) ?? '?'}</AvatarFallback>
            </Avatar>
            <span className="text-sm ml-2">{selected?.workspacename ?? 'Unnamed'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Select Workspace
          </p>
          <div className="flex flex-col gap-1">
            {workspaces.map((ws) => (
              <Button
                key={ws._id}
                variant="ghost"
                className="w-full flex items-center justify-between"
                onClick={() => onSelect(ws)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ws.picture} />
                    <AvatarFallback>{ws?.workspacename?.charAt(0) ?? '?'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ws.workspacename}</span>
                </div>
                {selected._id === ws._id && <Check className="w-4 h-4 text-blue-600" />}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
