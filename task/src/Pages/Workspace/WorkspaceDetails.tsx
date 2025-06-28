import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
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
import { Copy, Trash } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '../navbar/Navbar'
import Sidebar from './Sidebar'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface TeamMember {
    _id: string;
    name: string;
    email?: string;
    profilePic?: string;
}
interface Workspace {
    _id: string
    workspacename: string
    picture: string
    teammembers: TeamMember[]
}

const WorkspaceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [workspace, setWorkspace] = useState<Workspace | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [newName, setNewName] = useState('')
    const [newImage, setNewImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/work/workspaces/${id}`, {
                    withCredentials: true
                })
                setWorkspace(res.data.data)
                setNewName(res.data.data.workspacename)
                setPreview(res.data.data.picture)
            } catch (err) {
                console.error('Failed to fetch workspace details:', err)
            }
        }

        fetchWorkspace()
    }, [id])

    const inviteLink = `${window.location.origin}/join-workspace/${workspace?._id}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
        toast.success("Invite Link copied to clipboard")
    }

    const handleUpdate = async () => {
    try {
        const updateData = {
            workspacename: newName,
            picture: newImage // This should be the URL string
        };

        const res = await axios.put(
            `http://localhost:3000/work/workspaces/update/${workspace?._id}`,
            updateData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        toast.success("Workspace updated successfully");
        
        setWorkspace(prev => prev ? {
            ...prev,
            workspacename: newName,
            picture: newImage || prev.picture
        } : prev);
        
        setOpenDialog(false);
    } catch (err) {
        toast.error("Failed to update workspace");
        console.error(err);
    }
};

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/work/workspaces/delete/${workspace?._id}`, {
                withCredentials: true
            })
            toast.success("Workspace deleted")
            navigate('/dashboard')
        } catch (err) {
            toast.error("Failed to delete workspace")
            console.error(err)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    if (!workspace) {
        return <div className="text-center mt-10 text-blue-700">Loading workspace...</div>
    }

    return (
        <div className='h-screen w-full bg-slate-50 flex flex-col'>
            <Navbar />
            <div className='flex flex-1'>
                <Sidebar />
                <div className='w-1/2 ml-40 mt-4 mb-4 flex flex-col gap-4'>

                    {/* Workspace Details */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-[16px] font-bold'>WorkSpace Details</CardTitle>
                                <CardDescription>Manage the workspace in your own way</CardDescription>
                                <CardAction>
                                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                        <DialogTrigger asChild>
                                            <Button className='bg-blue-700 text-white hover:bg-blue-500'>Update</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Workspace</DialogTitle>
                                            </DialogHeader>
                                            <div className='flex flex-col gap-3'>
                                                <Input placeholder="Workspace Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                                <Input type="file" accept="image/*" onChange={handleImageChange} />
                                                {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />}
                                                <Button onClick={handleUpdate} className="bg-blue-700 text-white hover:bg-blue-500">Save Changes</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-4 items-center'>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={workspace.picture} />
                                        <AvatarFallback className='bg-blue-700 text-white text-[17px] font-extrabold'>
                                            {workspace.workspacename[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className='text-[17px] font-bold'>
                                        {workspace.workspacename[0].toUpperCase()}
                                        <span>{workspace.workspacename.slice(1)}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Invite Members */}
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
                    {/* <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-[16px] font-bold'>Members</CardTitle>
                                <CardAction><Button className='bg-blue-700 text-white hover:bg-blue-500'>Add Members</Button></CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-5 flex-wrap'>
                                    {workspace.teammembers.map((mem) => (
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
                    </div> */}

                    {/* Delete Workspace */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-[16px] font-bold text-red-600'>Delete Workspace</CardTitle>
                                <CardDescription>This action is permanent.</CardDescription>
                                <CardAction>
                                    <Button onClick={handleDelete} variant="destructive">
                                        <Trash className="w-4 h-4 mr-2" /> Delete Workspace
                                    </Button>
                                </CardAction>
                            </CardHeader>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default WorkspaceDetails
