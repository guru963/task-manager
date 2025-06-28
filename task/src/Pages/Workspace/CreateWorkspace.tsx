import React from 'react'
import Navbar from '../navbar/Navbar'
import Sidebar from './Sidebar'
import Workspace from '../Workcreate/Workspace'


const CreateWorkspace = () => {
  return (
    <div className='h-screen w-full bg-slate-50 flex flex-col'>
      <Navbar/>
      <div className='flex flex-1'>
        <Sidebar/>
      <Workspace/>
      </div>
    </div>
  )
}

export default CreateWorkspace