import React, { useEffect, useState } from 'react'
import { useAuth } from "../context/authcontext.tsx"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';

const JoinWorkspace = () => {
    interface Workspace {
        _id: string
        workspacename: string
        picture: string
        teammembers: []
    }
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate()
    const { id } = useParams()
    const [workspace, setWorkspace] = useState<Workspace>()
    useEffect(() => {
    if (!isAuthenticated) {
        navigate(`/sign-up?redirect=/join-workspace/${id}`)
        return
    }

    const fetchWorkspace = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/work/workspaces/${id}`, {
                withCredentials: true
            })
            setWorkspace(res.data.data)

            // Optional: auto-redirect if already a member
            const userId = res.data.userId  // <- only if your backend sends it
            if (res.data.data.teammembers.includes(userId)) {
                toast.info("You are already part of this workspace")
                navigate("/home-workspace")
            }

        } catch (err) {
            console.error('Failed to fetch workspace details:', err)
        }
    }

    fetchWorkspace()
}, [isAuthenticated, id, navigate])


    const handlesubmit=async()=>{
        const data=await axios.post(`http://localhost:3000/work/workspaces/${id}/join`,{},{
            withCredentials:true
        })

        toast.success("Added to workspace Successfully")
        navigate("/home-workspace")
    }
    return (
        <div className='bg-zinc-100 w-full h-screen'>
            <div className=' w-full h-1/2 flex justify-center items-center'>
            <Card className='border-2 border-blue-700 border-dashed w-1/2 '>
                <CardHeader>
                    <CardTitle className='text-[17px] font-bold '>Join Workspace</CardTitle>

                    <CardAction><Button className='bg-blue-600 hover:bg-blue-400 text-white font-bold' onClick={handlesubmit}>Join</Button></CardAction>
                </CardHeader>
                <CardContent>
                    <p>You have been invited to join the Workspace <b>{workspace?.workspacename}</b>.Manage your tasks and projects with logoipsum.Looking forward to with you all</p>
                </CardContent>
                <CardFooter>
                    <p className='font-bold'>Learn ,Live , Grow!!!</p>
                </CardFooter>
            </Card>
        </div>
        </div>


    )
}

export default JoinWorkspace