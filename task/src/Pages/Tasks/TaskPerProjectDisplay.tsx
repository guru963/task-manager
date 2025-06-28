import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Assuming this is your progress component
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog";
import TaskDetailandUpdateandDeleteCard from "./TaskDetailandUpdateandDeleteCard"

interface CreateTasksProps {
  projectid: string;
}

interface Member {
  name: string;
  _id: string;
  profilePic?: string;
}

interface Task {
  _id: string;
  tname: string;
  description: string;
  status: string;
  Datecomplete: string;
  priority: string;
  members: Member[];
}

const TaskPerProjectDisplay: React.FC<CreateTasksProps> = ({ projectid }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`http://localhost:3000/task/${projectid}/all-tasks`, {
        withCredentials: true
      });
      console.log(res.data.tasks)
      setTasks(res.data.tasks);
    };
    getData();
  },[projectid]);

  const getProgress = (status: string): number => {
    switch (status) {
      case "NewTask": return 0;
      case "Inprogress": return 30;
      case "Review": return 75;
      case "Completed": return 100;
      default: return 0;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100";
      case "High": return "bg-purple-100";
      case "Medium": return "bg-blue-100";
      case "Low": return "bg-gray-100";
      default: return "bg-white";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Inprogress":
        return "bg-blue-400 text-blue-800";
      case "Review":
        return "bg-orange-300 text-orange-800";
      case "NewTask":
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500";
      case "Inprogress": return "bg-blue-500";
      case "Review": return "bg-orange-500";
      case "NewTask": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };

  const getDaysLeftBadge = (Datecomplete: string) => {
    const daysLeft = Math.ceil((new Date(Datecomplete).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    let color = "bg-blue-300 text-blue-800";
    if (daysLeft <= 5) color = "bg-red-300 text-red-800";
    else if (daysLeft <= 15) color = "bg-orange-300 text-orange-800";

    return (
      <Badge className={cn("text-xs px-2 py-1 rounded", color)}>
        {daysLeft <= 0 ? "Overdue" : `${daysLeft} days left`}
      </Badge>
    );
  };

  return (
    <div className="flex flex-wrap gap-4">

      {tasks.length === 0 ? (
        <div className="text-center w-full text-gray-500 text-sm py-6">
          No tasks yet
        </div>) :
        tasks.map((task) => {
          const progress = getProgress(task.status);
          const progressColor = getProgressColor(task.status);
          const due = new Date(task.Datecomplete);
          const dueFormatted = due.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });


          return (
            <Dialog key={task._id}>
              <DialogTrigger asChild>
                <Card key={task._id} className={cn("w-[300px] h-[200px] rounded-xl shadow-sm flex flex-col gap-2", getPriorityColor(task.priority))}>
                  <CardHeader className="">
                    <div className="text-xs text-gray-500">{dueFormatted}</div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">{task.tname}</CardTitle>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>{task.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description.length < 50 ? task.description : task.description.slice(0, 70) + "..."}</p>
                  </CardHeader>

                  <CardContent className="pt-0 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-600 ">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 rounded-full" />
                    <div className='flex justify-between items-center pt-3'>
                      <div className="flex items-center -space-x-2">
                        {task.members.slice(0, 3).map((member) => (
                          <Avatar key={member._id} className="h-7 w-7 border-2 border-white shadow-sm">
                            <AvatarImage src={member.profilePic || ''} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {member.name?.[0]?.toUpperCase() || "M"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.members.length > 3 && (
                          <div className="text-xs text-gray-500 ml-2">+{task.members.length - 3}</div>
                        )}
                      </div>
                      {getDaysLeftBadge(task.Datecomplete)}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <TaskDetailandUpdateandDeleteCard task={task} />
              </DialogContent>
            </Dialog>
          );
        })}
    </div>
  );
};

export default TaskPerProjectDisplay;
