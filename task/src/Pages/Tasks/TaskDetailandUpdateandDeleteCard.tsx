import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axios from 'axios'
import { useWorkspace } from '../../context/WorkspaceContext'

interface TaskDetailProps {
  task: {
    _id: string;
    tname: string;
    description: string;
    Datecomplete: string;
    status: string;
    priority: string;
    projectid:string;
    members: { name: string; _id: string; profilePic?: string }[];
  };
  allMembers: { name: string; _id: string; profilePic?: string }[];
  onSuccess?: () => void;
}

const TaskDetailandUpdateandDeleteCard: React.FC<TaskDetailProps> = ({ task, allMembers, onSuccess }) => {
    const { selectedWorkspace } = useWorkspace()

    console.log(selectedWorkspace)
    console.log(task)
  const [tname, setTname] = React.useState(task.tname)
  const [description, setDescription] = React.useState(task.description)
  const [Datecomplete, setDate] = React.useState<Date | undefined>(new Date(task.Datecomplete))
  const [status, setStatus] = React.useState(task.status)
  const [priority, setPriority] = React.useState(task.priority)
  const [members, setMembers] = React.useState(task.members)
 const [allmembers,setallmembers]=React.useState(selectedWorkspace.teammembers)
  

  const statusOptions = [
    { value: "NewTask", label: "New Task" },
    { value: "Inprogress", label: "In Progress" },
    { value: "Review", label: "Review" },
    { value: "Completed", label: "Completed" },
    { value: "OverDue", label: "Overdue" },
  ]
  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" }
  ]

  const getColor = (value: string, type: 'status' | 'priority') => {
    const colors: Record<string, string> = {
      Completed: "bg-green-100 text-green-800",
      Inprogress: "bg-blue-100 text-blue-800",
      OverDue: "bg-red-100 text-red-800",
      Review: "bg-yellow-100 text-yellow-800",
      NewTask: "bg-gray-100 text-gray-800",
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-orange-100 text-orange-800",
      Urgent: "bg-red-100 text-red-800",
    }
    return colors[value] || "bg-gray-100 text-gray-800"
  }

  const handleUpdate = async () => {
    console.log({
        tname,
        description,
        Datecomplete: Datecomplete?.toISOString(),
        status,
        priority,
        members: members.map(m => m._id)
    }
    )
    try {
      await axios.put(`http://localhost:3000/task/${task.projectid}/${task._id}/update`, {
        tname,
        description,
        Datecomplete: Datecomplete?.toISOString(),
        status,
        priority,
        members: members.map(m => m._id)
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      toast.success("Task updated successfully")
      onSuccess?.()
    } catch (err) {
      toast.error("Failed to update task")
      console.error(err)
    }
  }

  const handleDelete = async () => {
    console.log("Delete button clicked")
    try {
      await axios.delete(`http://localhost:3000/task/${task.projectid}/${task._id}/delete`, {
        withCredentials: true
      })
      toast.success("Task deleted successfully")
      onSuccess?.()
    } catch (err) {
      toast.error("Failed to delete task")
      console.error(err)
     }
  }

  const toggleMember = (member: { _id: string; name: string; profilePic?: string }) => {
    const exists = members.find(m => m._id === member._id)
    if (exists) {
      setMembers(prev => prev.filter(m => m._id !== member._id))
    } else {
      setMembers(prev => [...prev, member])
    }
  }

  return (
    <Card className="border-blue-700 border-2 border-dashed m-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
        <CardDescription>Update the task details below</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div>
          <label className="block font-medium text-sm">Task Name</label>
          <Input value={tname} onChange={(e) => setTname(e.target.value)} />
        </div>

        <div>
          <label className="block font-medium text-sm">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block font-medium text-sm">Priority</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className={`px-2 py-1 rounded ${getColor(priority, 'priority')}`}>{priority}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {priorityOptions.map(opt => (
                <DropdownMenuItem key={opt.value} onSelect={() => setPriority(opt.value)}>
                  <div className={`px-2 py-1 rounded ${getColor(opt.value, 'priority')}`}>{opt.label}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block font-medium text-sm">Status</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className={`px-2 py-1 rounded ${getColor(status, 'status')}`}>
                  {statusOptions.find(s => s.value === status)?.label}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map(opt => (
                <DropdownMenuItem key={opt.value} onSelect={() => setStatus(opt.value)}>
                  <div className={`px-2 py-1 rounded ${getColor(opt.value, 'status')}`}>{opt.label}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block font-medium text-sm">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {Datecomplete?.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={Datecomplete}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block font-medium text-sm">Assigned Members</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {members.length > 0 ? `${members.length} selected` : "Select Members"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-auto">
              {allmembers.map(member => (
                <DropdownMenuCheckboxItem
                  key={member._id}
                  checked={members.some(m => m._id === member._id)}
                  onCheckedChange={() => toggleMember(member)}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.profilePic || ''} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {members.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map(member => (
                <Badge key={member._id} variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={member.profilePic || ''} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardAction className="px-6  flex justify-end gap-3">
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
        <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Check className="h-4 w-4 mr-2" /> Update Task
        </Button>
      </CardAction>
    </Card>
  )
}

export default TaskDetailandUpdateandDeleteCard
