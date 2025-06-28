import React, { useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { toast } from 'sonner'
const Workspace = () => {

    const [formdata, setformdata] = useState<{
        workspacename: string
        picture: string
        teammembers: string[]
    }>({
        workspacename: "",
        picture: "",
        teammembers: []
    })

    const sampledata = [
        { id: "1", name: "Alice Johnson" },
        { id: "2", name: "Bob Smith" },
        { id: "3", name: "Charlie Kim" },
        { id: "4", name: "Dana Lee" },
    ]

    const [persons, setpersons] = useState<string[]>([])
    const [search, setsearch] = useState<string>("")

    const modifieddata = sampledata.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    )

    const togglefunction = (id: string) => {
        setpersons((prev) =>
            prev.includes(id)
                ? prev.filter(uid => uid !== id)
                : [...prev, id]
        )
    }

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setformdata((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setformdata((prev) => ({
        ...prev,
        picture: reader.result as string // base64 string
      }))
    }
    reader.readAsDataURL(file)
  }
}


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setformdata((prev) => ({ ...prev, teammembers: persons }))

 try {
     const res = await axios.post("http://localhost:3000/work/workspace-register", formdata, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })

  console.log(res.data)
  toast.success("Workspace Created Successfully")
 } catch (error) {
    console.log(error)
    toast.error("Failed to set up a Workspace")
 }
}




    return (
        <div className='flex-1 w-[500px] h-auto items-center justify-center flex'>
            <Card className='w-[700px] h-[500px] border-blue-500 border-dashed border-3 p-3'>
                <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className='text-bold text-[20px]'>Create your Workspace</CardTitle>
                    <CardDescription className='text-zinc-400'>Create your own workspace and enjoy creating projects.</CardDescription>
                    
                    <CardAction>
                        <Button type="submit" className='bg-blue-700 w-[100px] text-white hover:bg-blue-500 ' >Create</Button>
                    </CardAction>
                </CardHeader>
                   
                    <CardContent>
                        <p className='m-2 text-[16px] font-bold'>Enter your Workspace Name</p>
                    </CardContent>
                    <CardContent>
                        <Input id="workspacename" type="text" placeholder='Workspace Name' value={formdata.workspacename} onChange={handlechange}className='w-3/4 m-2 border-blue-500 border-dotted border-2'></Input>
                    </CardContent>
                    <CardContent>
                        <p className='mt-6 m-2 text-[16px] font-bold'>Profile Picture</p>
                    </CardContent>
                    <CardContent>
                        <div className=" items-center gap-3">
                            <Input id="picture" type="file" className='w-3/4 m-2 border-blue-500 border-dotted border-2' onChange={handleFileChange} />
                        </div>
                    </CardContent>
                    <CardContent>
                        <p className='mt-6 m-2 text-[16px] font-bold'>Add teammates</p>
                    </CardContent>

                    <Dialog>
                        <DialogTrigger className='w-[470px] m-2 ml-8 border-blue-500 border-dotted border-2 p-1 pl-3 text-left rounded text-[16px]'>Add your teammates</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-[17px] font-bold'>Select to add teammates</DialogTitle>
                                <DialogDescription>
                                    <Input type="text" id="search" placeholder='Search' onChange={(e) => setsearch(e.target.value)}></Input>
                                </DialogDescription>
                                <div className='flex flex-col gap-4 m-4'>
                                    {
                                        modifieddata.map(user => (
                                            <div className='flex justify-items-start gap-2 items-center'>
                                                <Checkbox
                                                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                    checked={persons.includes(user.id)}
                                                    onCheckedChange={() => togglefunction(user.id)}
                                                />


                                                <span className='text-[17px] font-medium'>{user.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <CardFooter>
                        <p className='mt-4 font-bold text-[16px]'>Enjoy Creating and Crafting...</p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Workspace