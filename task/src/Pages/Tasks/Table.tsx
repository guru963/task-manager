import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CiSettings } from "react-icons/ci";
import { BsThreeDotsVertical, BsFilter } from "react-icons/bs";
import { FiCalendar, FiLayers } from "react-icons/fi";
import axios from 'axios';
import clsx from 'clsx';
import { useWorkspace } from '@/context/WorkspaceContext';
import TaskDetailandUpdateandDeleteCard from './TaskDetailandUpdateandDeleteCard'; // Adjust the import path as needed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamMember {
  name: string;
  email: string;
  _id: string;
  profilePic?: string;
}

interface Project {
  _id: string;
  pname: string;
}

interface Task {
  _id: string;
  Datecomplete: string;
  description: string;
  tname: string;
  members: TeamMember[];
  status: string;
  priority: string;
  projectid: Project;
}

const statusColors: Record<string, string> = {
  "NewTask": "bg-zinc-300 text-grey-800",
  "Inprogress": "bg-blue-100 text-blue-800",
  "Review": "bg-orange-100 text-orange-800",
  "Completed": "bg-green-200 text-green-800",
  "OverDue": "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  "Urgent": "bg-red-300 text-red-800",
  "High": "bg-orange-200 text-orange-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "Low": "bg-green-100 text-green-800",
};

const iconColors = [
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800",
  "bg-amber-100 text-amber-800",
];

const Tables = () => {
  const [data, setData] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterMember, setFilterMember] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'view' | 'edit'>('view');
  const itemsPerPage = 5;

  const { selectedWorkspace } = useWorkspace();
  const [projectData, setProjectData] = useState<Project[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(`http://localhost:3000/task/every-tasks?workspaceId=${selectedWorkspace._id}`, {
        withCredentials: true
      });
      setData(res.data.tasks);
    };

    const fetchProjects = async () => {
      const res = await axios.get(`http://localhost:3000/project/all-projects?workspaceId=${selectedWorkspace._id}`, {
        withCredentials: true
      });
      setProjectData(res.data.data);
    };

    fetchTasks();
    fetchProjects();
  }, [selectedWorkspace, isDialogOpen]); // Added isDialogOpen to refetch when dialog closes

  const getProjectName = (project: string | Project) => {
    if (typeof project === 'string') {
      const proj = projectData.find(p => p._id === project);
      return proj?.pname || "Unknown";
    }
    return project.pname;
  };

  const getRandomIconColor = (taskName: string) => {
    const charCode = taskName.charCodeAt(0) || 0;
    return iconColors[charCode % iconColors.length];
  };

  const getDeadlineStatus = (deadline: string) => {
    if (!deadline) return "";
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const handleTaskAction = (task: Task, action: 'view' | 'edit' | 'delete') => {
    setSelectedTask(task);
    if (action === 'delete') {
      // Handle delete immediately if needed
      return;
    }
    setActionType(action);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // The useEffect will trigger a refetch because isDialogOpen changed
  };

  const filteredData = data.filter(task => {
    const statusMatch = filterStatus ? task.status === filterStatus : true;
    const projectMatch = filterProject ? task.projectid._id === filterProject : true;
    const priorityMatch = filterPriority ? task.priority === filterPriority : true;
    const memberMatch = filterMember ? task.members.some(m => m.name === filterMember) : true;
    return statusMatch && projectMatch && priorityMatch && memberMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueMembers = Array.from(new Set(data.flatMap(task => task.members.map(m => m.name))));

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Project Filter */}
          <div className="flex items-center space-x-2">
            <FiLayers className="text-gray-500" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <BsFilter />
                  {filterProject ? getProjectName(filterProject) : "All Projects"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {projectData.map((proj) => (
                  <DropdownMenuItem key={proj._id} onClick={() => setFilterProject(proj._id)}>
                    {proj.pname}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setFilterProject(null)}>Clear Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <CiSettings className="text-gray-500" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <BsFilter />
                  {filterStatus || "All Statuses"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(statusColors).map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>Clear Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <CiSettings className="text-gray-500" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <BsFilter />
                  {filterPriority || "All Priorities"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(priorityColors).map((priority) => (
                  <DropdownMenuItem key={priority} onClick={() => setFilterPriority(priority)}>
                    {priority}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setFilterPriority(null)}>Clear Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Member Filter */}
          <div className="flex items-center space-x-2">
            <CiSettings className="text-gray-500" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <BsFilter />
                  {filterMember || "All Members"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {uniqueMembers.map((member) => (
                  <DropdownMenuItem key={member} onClick={() => setFilterMember(member)}>
                    {member}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setFilterMember(null)}>Clear Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableCaption>All tasks listed below with current progress status.</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>#</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                  No tasks found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((task, index) => (
                <TableRow key={task._id} className="hover:bg-gray-50">
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-medium">{getProjectName(task.projectid)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRandomIconColor(task.tname)}`}>
                        {task.tname.charAt(0).toUpperCase()}
                      </div>
                      <div>{task.tname}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", statusColors[task.status])}>
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell className={clsx("font-medium", getDeadlineStatus(task.Datecomplete))}>
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      {task.Datecomplete.slice(0, 10)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center -space-x-2">
                      {task.members.slice(0, 2).map((member, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div
                              className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold border-2 border-white cursor-pointer"
                              style={{ zIndex: 10 - idx }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{member.name}</TooltipContent>
                        </Tooltip>
                      ))}
                      {task.members.length > 2 && (
                        <div className="text-xs ml-2 text-gray-600">+{task.members.length - 2}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTaskAction(task, 'view')}>View Details</DropdownMenuItem>
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Task Detail Dialog */}
        {selectedTask && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {actionType === 'view' ? 'Task Details' : 'Edit Task'}
                </DialogTitle>
              </DialogHeader>
              <TaskDetailandUpdateandDeleteCard
                task={{
                  ...selectedTask,
                  projectid: selectedTask.projectid._id // Convert to string as expected by the component
                }}
                allMembers={selectedWorkspace.teammembers}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t rounded-b-md">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} tasks
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Tables;