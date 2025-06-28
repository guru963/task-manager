import React, { useState } from 'react'
import Navbar from './Pages/navbar/Navbar'
import Signin from './Pages/auth/Signin'
import Signup from './Pages/auth/Signup'
// import TestToast from './test'
const App = () => {
  const [islogged,setislogged]=useState<boolean>(false)
  return (
    <>
    <div className='h-screen w-full bg-slate-100'>
      <Navbar/>
      {
        islogged?<div className='flex justify-center items-center m-10'>
        <Signin/>
      </div>:
       <div className='flex justify-center items-center m-10'>
        <Signup/>
      </div>
      }
     
    </div>

    </>
  )
}

export default App