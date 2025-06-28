import React from 'react'
import logo from '../../assets/logo.png'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/authcontext.tsx"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
console.log(isAuthenticated)
  return (
    <div className='py-2 px-4 w-full bg-white flex justify-between items-center shadow-md'>
      <img src={logo} className='w-[200px] h-[50px]' alt="Logo" />
      
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className='flex justify-between gap-x-3'>
          <Button asChild className='bg-blue-600 text-white hover:bg-blue-500'>
            <Link to='/sign-in'>Sign In</Link>
          </Button>
          <Button asChild className='bg-white text-black border-2 border-black hover:bg-blue-500 hover:border-0 hover:text-white'>
            <Link to='/sign-up'>Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Navbar
