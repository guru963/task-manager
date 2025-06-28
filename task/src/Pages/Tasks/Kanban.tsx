import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { FiCalendar } from "react-icons/fi";
import axios from "axios";
import { useWorkspace } from "@/context/WorkspaceContext";

// Status columns
const statusColumns = ["NewTask", "Inprogress", "Review", "Completed", "OverDue"] as const;

const statusColors = {
  NewTask: "bg-zinc-300 text-gray-800",
  Inprogress: "bg-blue-100 text-blue-800",
  Review: "bg-orange-100 text-orange-800",
  Completed: "bg-green-200 text-green-800",
  OverDue: "bg-red-100 text-red-800",
};

const priorityColors = {
  Urgent: "bg-red-300 text-red-800",
  High: "bg-orange-200 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const iconColors = ["bg-purple-100 text-purple-800", "bg-pink-100 text-pink-800", "bg-indigo-100 text-indigo-800", "bg-teal-100 text-teal-800", "bg-amber-100 text-amber-800"];

type Task = {
  _id: string;
  tname: string;
  projectid: { pname: string };
  Datecomplete: string;
  priority: keyof typeof priorityColors;
  status: string;
  members?: { name: string; email: string }[];
};

// Helpers
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getDeadlineStatus = (deadline: string) => {
  const dueDate = new Date(deadline);
  const today = new Date();
  const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    text: diff < 0 ? `${Math.abs(diff)} days overdue` : `${diff} days left`,
    color: diff < 0 ? "text-red-500" : diff <= 3 ? "text-yellow-500" : "text-green-500",
  };
};

// Task Card
function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const iconColor = iconColors[task.tname.charCodeAt(0) % iconColors.length];
  const deadline = getDeadlineStatus(task.Datecomplete);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded shadow cursor-grab active:cursor-grabbing space-y-2"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", iconColor)}>
          {task.tname.charAt(0).toUpperCase()}
        </div>
        <div className="font-medium">{task.tname}</div>
      </div>

      {/* Project Name */}
      <div className="text-sm text-gray-500">{task.projectid.pname}</div>

      {/* Priority */}
      <div className="flex justify-between items-center">
        <div
        className={clsx(
          "inline-block text-xs px-2 py-1 rounded-full w-fit",
          priorityColors[task.priority]
        )}
      >
        {task.priority}
      </div>

      {/* Members */}
      {task.members?.length > 0 && (
        <div className="flex -space-x-2 overflow-hidden mt-1">
          {task.members.slice(0, 4).map((member, idx) => (
            <div
              key={idx}
              title={`${member.name} (${member.email})`}
              className="w-7 h-7 rounded-full bg-gray-200 text-xs text-gray-800 flex items-center justify-center border border-white shadow"
            >
              {initials(member.name)}
            </div>
          ))}
          {task.members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-300 text-xs flex items-center justify-center border border-white shadow">
              +{task.members.length - 4}
            </div>
          )}
        </div>
      )}

    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1 text-[10px]">
        <FiCalendar />
        <span className={deadline.color}>{task.Datecomplete.slice(0, 10)}</span>
      </div>
     <div className={clsx("text-xs font-medium", deadline.color)}>
        {deadline.text}
      </div>
    </div>
      </div>
  );
}

// Column Container
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { id } });
  return (
    <div
      ref={setNodeRef}
      className={clsx("bg-gray-50 p-3 rounded-lg shadow-inner min-h-[200px] transition-all", {
        "ring ring-blue-300": isOver,
      })}
    >
      {children}
    </div>
  );
}

// Kanban Board
export default function KanbanBoard() {
  const { selectedWorkspace } = useWorkspace();
  const [columns, setColumns] = useState<Record<string, Task[]>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    axios
      .get(`http://localhost:3000/task/every-tasks?workspaceId=${selectedWorkspace._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const organized: Record<string, Task[]> = Object.fromEntries(statusColumns.map((s) => [s, []]));

        res.data.tasks.forEach((t: Task) => {
          const isOverdue = t.status !== "Completed" && new Date(t.Datecomplete) < new Date();
          const col = isOverdue ? "OverDue" : t.status;
          organized[col]?.push(t);
        });

        setColumns(organized);
      });
  }, [selectedWorkspace]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = Object.entries(columns).find(([_, tasks]) => tasks.find((t) => t._id === active.id))?.[0];
    const to = (over.data.current as any)?.id;
    if (!from || !to || from === to) return;

    const task = columns[from].find((t) => t._id === active.id)!;

    setColumns({
      ...columns,
      [from]: columns[from].filter((t) => t._id !== active.id),
      [to]: [...columns[to], { ...task, status: to }],
    });

      // Update on the backend
  axios
    .patch(
      `http://localhost:3000/task/${task.projectid}/${task._id}`,
      { status: to },
      { withCredentials: true }
    )
    .then((res) => {
      console.log("Task status updated:", res.data);
    })
    .catch((err) => {
      console.error("Failed to update task status", err);
      // Optionally: revert optimistic update if backend fails
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map((colId) => (
          <DroppableColumn key={colId} id={colId}>
            <div className={clsx("mb-2 text-sm font-semibold px-2 py-1 rounded", statusColors[colId])}>
              {colId}
            </div>
            <SortableContext
              items={columns[colId]?.map((t) => t._id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {columns[colId]?.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
