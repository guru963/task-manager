import React from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
const Members = () => {
  const {selectedWorkspace}=useWorkspace()
  console.log(selectedWorkspace)
const inviteLink = `${window.location.origin}/join-workspace/${selectedWorkspace?._id}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
        toast.success("Invite Link copied to clipboard")
    }
  
  return (
    <div className='h-screen w-full bg-slate-50 flex flex-col'>
            <Navbar />
            <div className='flex flex-1'>
                <Sidebar />
                <div className='w-1/2 ml-40 mt-4 mb-4 flex flex-col gap-4'>
                <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-[16px] font-bold'>Invite Members</CardTitle>
                                <CardDescription>Send Links to invite members</CardDescription>
                                <CardAction>
                                    <Button className='bg-blue-700 text-white hover:bg-blue-500'>Invite</Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Input value={inviteLink} readOnly className="text-sm bg-white text-blue-700" />
                                    <Button variant="outline" className="text-blue-700 border-blue-500" onClick={copyToClipboard}>
                                        <Copy className="w-4 h-4 mr-1" /> Copy
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


          {/* Members List */}
                     <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-[16px] font-bold'>Members</CardTitle>
                                <CardDescription>To add Members Copy the link and invite Members to join the workspace</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-5 flex-wrap'>
                                    {selectedWorkspace.teammembers.map((mem) => (
                                        <div key={mem._id} className='flex gap-4 items-center'>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={mem.profilePic || ''} />
                                                <AvatarFallback className='bg-blue-700 text-white text-[16px] font-bold'>
                                                    {mem.name ? mem.name[0].toUpperCase() : 'M'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className='text-[15px] font-bold'>{mem.name || "Unnamed Member"}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div> 

        </div>
        </div>
        </div>
  )
}

export default Members