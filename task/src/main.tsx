import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Signin from './Pages/auth/Signin.tsx'
import Signup from './Pages/auth/Signup.tsx'
import HomePage from './Pages/Workspace/Home.tsx'
import { AuthProvider } from './context/authcontext.tsx'
import { WorkspaceProvider } from './context/Workspacecontext.tsx'
import { Toaster } from "@/components/ui/sonner"
import Mytasks from './Pages/Workspace/Mytasks.tsx'
import Members from './Pages/Workspace/Members.tsx'
import CreateWorkspace from './Pages/Workspace/CreateWorkspace.tsx'
import ProjectCard from './Pages/Projects/ProjectCard.tsx'
import WorkspaceDetails from './Pages/Workspace/WorkspaceDetails.tsx'
import JoinWorkspace from './User/JoinWorkspace.tsx'
import Createtasks from './Pages/Projects/Createtasks.tsx'
createRoot(document.getElementById('root')!).render(

  <AuthProvider>
    <WorkspaceProvider>
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path="/sign-in" element={<Signin/>}/>
    <Route path="/sign-up" element={<Signup/>}/>
    <Route path='/home-workspace' element={<HomePage/>}/>
    <Route path="/workspace/:id" element={<WorkspaceDetails />} />
     <Route path='/home-workspace/create' element={<CreateWorkspace/>}/>
    <Route path='/home-workspace/my-tasks' element={<Mytasks/>}/>
    <Route path='/home-workspace/members' element={<Members/>}/>
    <Route path="/project/:id" element={<ProjectCard/>}/>
    {/* <Route path="/project/:id/create-task" element={<ProjectCard/>}/> */}
    <Route path="/join-workspace/:id" element={<JoinWorkspace />} />


  </Routes>
  <Toaster  richColors position="top-center"/>
  </BrowserRouter>
  </WorkspaceProvider>
  </AuthProvider>
  ,
)
