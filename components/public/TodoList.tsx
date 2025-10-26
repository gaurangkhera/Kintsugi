"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export function TodoList() {
  const [newTask, setNewTask] = useState("");
  const tasks = useQuery(api.tasks.getTasks) ?? [];
  const createTask = useMutation(api.tasks.createTask);
  const toggleTask = useMutation(api.tasks.toggleTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      await createTask({ body: newTask });
      setNewTask("");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTask} className="flex gap-3">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          Add Task
        </Button>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base mb-2">
              No tasks yet
            </p>
            <p className="text-gray-600 text-sm">
              Add your first task to get started
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <Checkbox
                checked={task.isCompleted}
                onCheckedChange={() => toggleTask({ taskId: task._id })}
                className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <span
                className={`flex-1 text-base ${
                  task.isCompleted
                    ? "line-through text-gray-500"
                    : "text-white"
                }`}
              >
                {task.body}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask({ taskId: task._id })}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
