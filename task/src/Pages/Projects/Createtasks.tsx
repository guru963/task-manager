import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
interface CreateTasksProps {
  projectid: string;
  onSuccess?: () => void;
}
const Createtasks: React.FC<CreateTasksProps> = ({ projectid ,onSuccess}) => {
  
  console.log("ProjectId")
  console.log(projectid)
  const { selectedWorkspace } = useWorkspace()
  const [Datecomplete, setDate] = React.useState<Date | undefined>(new Date())
  const [openCalendar, setOpenCalendar] = React.useState(false)
  const [tname, setTaskName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState("NewTask")
  const [members, setSelectedMembers] = React.useState<Array<{
    _id: string
    name: string
    profilePic?: string
  }>>([])
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = React.useState(false)
  const [priority, setPriority] = React.useState("Medium")
const [priorityDropdownOpen, setPriorityDropdownOpen] = React.useState(false)

  const navigate=useNavigate()

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


  const handleMemberSelect = (member: {
    _id: string
    name: string
    profilePic?: string
  }) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m._id === member._id)
      if (isSelected) {
        return prev.filter(m => m._id !== member._id)
      } else {
        return [...prev, member]
      }
    })
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(m => m._id !== memberId))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({
      tname,
      description,
      status,
      Datecomplete,
      priority,
      members:members.map(member => member._id)
    })

    try {
      const data=await axios.post(`http://localhost:3000/task/${projectid}/create-task`,{
      tname,
      description,
      status,
      members:members.map(member => member._id),
      Datecomplete:Datecomplete?.toISOString(),
      priority
    },{
      withCredentials:true,
       headers:{
            "Content-Type":"application/json"
          }
    })
    toast.success("Task Created Successfully")
    if (onSuccess) onSuccess() 
    } catch (error) {
      console.log(error)
      toast.error("Error in creating the Task")
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Inprogress":
        return "bg-blue-100 text-blue-800"
      case "OverDue":
        return "bg-red-100 text-red-800"
      case "Review":
        return "bg-yellow-100 text-yellow-800"
      case "NewTask":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getPriorityColor = (priorityValue: string) => {
  switch (priorityValue) {
    case "Low":
      return "bg-green-100 text-green-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "High":
      return "bg-orange-100 text-orange-800"
    case "Urgent":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}


  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <Card className="border-blue-700 border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Create New Task</CardTitle>
            <CardDescription>
              Fill in the details to create a new task for your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="space-y-0.5">
              <label htmlFor="task-name" className="block font-medium text-sm">
                Task Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="task-name"
                type="text"
                placeholder="Enter task name"
                value={tname}
                onChange={(e) => setTaskName(e.target.value)}
                required
                className="focus-visible:ring-blue-500 border-blue-700 border-2 border-dashed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium text-sm">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="focus-visible:ring-blue-500 min-h-[60px] border-blue-700 border-2 border-dashed"
              />
            </div>
            <div className="space-y-2">
  <label className="block font-medium text-sm">Priority</label>
  <DropdownMenu open={priorityDropdownOpen} onOpenChange={setPriorityDropdownOpen}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="w-full justify-between font-normal border-blue-700 border-2 border-dashed"
      >
        <span className={`px-2 py-1 rounded ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[200px]">
      {priorityOptions.map((option) => (
        <DropdownMenuItem
          key={option.value}
          onSelect={() => setPriority(option.value)}
          className="cursor-pointer"
        >
          <div className={`px-2 py-1 rounded ${getPriorityColor(option.value)}`}>
            {option.label}
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</div>


            <div className="space-y-2">
              <label className="block font-medium text-sm">Status</label>
              <DropdownMenu open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal border-blue-700 border-2 border-dashed"
                  >
                    <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
                      {statusOptions.find(opt => opt.value === status)?.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setStatus(option.value)}
                      className="cursor-pointer"
                    >
                      <div className={`px-2 py-1 rounded ${getStatusColor(option.value)}`}>
                        {option.label}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-sm">Assigned Members</label>
              
              {/* Selected members preview */}
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {members.map(member => (
                    <Badge 
                      key={member._id} 
                      variant="outline"
                      className="flex items-center gap-2 py-1 pl-2 pr-1 rounded-full"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.profilePic || ''} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(member._id)}
                        className="text-gray-500 hover:text-red-500 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal border-blue-700 border-2 border-dashed"
                  >
                    {members.length > 0 
                      ? `${members.length} member(s) selected` 
                      : "Select team members"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto">
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    Select members to assign
                  </div>
                  {selectedWorkspace.teammembers.map(member => (
                    <DropdownMenuCheckboxItem
                      key={member._id}
                      checked={members.some(m => m._id === member._id)}
                      onCheckedChange={() => handleMemberSelect(member)}
                      className="flex items-center gap-3 py-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.profilePic || ''} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label htmlFor="due-date" className="block font-medium text-sm">
                Due Date
              </label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="due-date"
                    className="w-full justify-between font-normal border-blue-700 border-2 border-dashed"
                  >
                    {Datecomplete ? (
                      Datecomplete.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    ) : (
                      "Select a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={Datecomplete}
                    onSelect={(date) => {
                      setDate(date)
                      setOpenCalendar(false)
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardAction className="px-6 pb-6">
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Check className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          </CardAction>
        </Card>
      </form>
    </div>
  )
}

export default Createtasks