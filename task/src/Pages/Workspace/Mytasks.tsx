import React, { use, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Sidebar from './Sidebar'
import Tables from '../Tasks/Table'
import { Button } from '@/components/ui/button'
import KanbanBoard from '../Tasks/Kanban'
import Calender from '../Tasks/Calender'


const Mytasks = () => {

  const [buttonon,setbuttonon]=useState(true)
  const [Kanbanon,setkanbanon]=useState(false)
  const [Calenderon,setcalenderon]=useState(false)

  const tablesubmit=()=>{
    setbuttonon(true)
    setkanbanon(false)
    setcalenderon(false)
  }
  const kanbansubmit=()=>{
    setbuttonon(false)
    setkanbanon(true)
    setcalenderon(false)
  }
  const calendersubmit=()=>{
    setbuttonon(false)
    setkanbanon(false)
    setcalenderon(true)
  }
  return (
    <div>
        <div className='h-screen w-full bg-slate-50 flex flex-col'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='w-full m-4'>
          <div>
            <p className='font-bold m-4'>My Tasks</p>
          <div className='flex gap-5 m-4'>
            <Button onClick={tablesubmit}>Table</Button>
            <Button onClick={kanbansubmit}>Kanban</Button>
            <Button onClick={calendersubmit}>Calender</Button>
          </div>
        
         

          </div>
          {
            buttonon?<Tables/>:<></>
          }
          {
            Kanbanon?<KanbanBoard/>:<></>
          }
          {Calenderon?<Calender/>:<></>}
        </div>
        </div>
        </div>
    </div>
  )
}

export default Mytasks