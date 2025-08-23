// import { useState, useEffect } from 'react';
// import { Task, User } from '../types';

// const TASKS_STORAGE_KEY = 'beats_medical_tasks';

// const loadTasksFromStorage = (): Task[] => {
//   try {
//     const stored = localStorage.getItem(TASKS_STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch (error) {
//     console.error('Error loading tasks from storage:', error);
//     return [];
//   }
// };

// const saveTasksToStorage = (tasks: Task[]) => {
//   try {
//     localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
//   } catch (error) {
//     console.error('Error saving tasks to storage:', error);
//   }
// };

// export const useTasks = (currentUser: User | null) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (currentUser) {
//       fetchTasks();
//     }
//   }, [currentUser]);

//   const fetchTasks = async () => {
//     if (!currentUser) return;

//     try {
//       setLoading(true);
      
//       // Load tasks from localStorage
//       const allTasks = loadTasksFromStorage();
      
//       // Filter tasks based on user role and assignment
//       let userTasks: Task[] = [];
      
//       if (currentUser.role === 'CEO' || currentUser.role === 'Director') {
//         // CEO and Directors can see all tasks
//         userTasks = allTasks;
//       } else {
//         // Employees can only see tasks assigned to them
//         userTasks = allTasks.filter(task => task.assigned_to === currentUser.id);
//       }
      
//       setTasks(userTasks);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
//     if (!currentUser) return;

//     try {
//       // Create local task object
//       const newTask: Task = {
//         id: Date.now().toString(),
//         ...taskData,
//         assigned_by: currentUser.id,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };
      
//       // Load all tasks from storage
//       const allTasks = loadTasksFromStorage();
//       const updatedAllTasks = [newTask, ...allTasks];
      
//       // Save to storage
//       saveTasksToStorage(updatedAllTasks);
      
//       // Update local state based on user role
//       if (currentUser.role === 'CEO' || currentUser.role === 'Director') {
//         setTasks(updatedAllTasks);
//       } else {
//         // For employees, only show tasks assigned to them
//         const userTasks = updatedAllTasks.filter(task => task.assigned_to === currentUser.id);
//         setTasks(userTasks);
//       }
//     } catch (error) {
//       console.error('Error adding task:', error);
//     }
//   };

//   const updateTask = async (taskId: string, updates: Partial<Task>) => {
//     try {
//       // Load all tasks from storage
//       const allTasks = loadTasksFromStorage();
//       const updatedAllTasks = allTasks.map(task => 
//         task.id === taskId 
//           ? { ...task, ...updates, updated_at: new Date().toISOString() }
//           : task
//       );
      
//       // Save to storage
//       saveTasksToStorage(updatedAllTasks);
      
//       // Update local state based on user role
//       if (currentUser && (currentUser.role === 'CEO' || currentUser.role === 'Director')) {
//         setTasks(updatedAllTasks);
//       } else if (currentUser) {
//         // For employees, only show tasks assigned to them
//         const userTasks = updatedAllTasks.filter(task => task.assigned_to === currentUser.id);
//         setTasks(userTasks);
//       }
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   const deleteTask = async (taskId: string) => {
//     try {
//       // Load all tasks from storage
//       const allTasks = loadTasksFromStorage();
//       const updatedAllTasks = allTasks.filter(task => task.id !== taskId);
      
//       // Save to storage
//       saveTasksToStorage(updatedAllTasks);
      
//       // Update local state
//       setTasks(prev => prev.filter(task => task.id !== taskId));
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   return {
//     tasks,
//     loading,
//     addTask,
//     updateTask,
//     deleteTask,
//     refetch: fetchTasks
//   };
// };



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Task, CreateTaskDto, UpdateTaskDto } from "../types";

// export function useTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // fetch all tasks
//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get<Task[]>("http://localhost:5000/api/tasks");
//       setTasks(res.data);
//     } catch (err: any) {
//       setError(err.message || "Error fetching tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // create task
//   const addTask = async (task: CreateTaskDto) => {
//     try {
//       const res = await axios.post<Task>("http://localhost:5000/api/tasks", task);
//       setTasks((prev) => [...prev, res.data]);
//     } catch (err: any) {
//       setError(err.message || "Error creating task");
//     }
//   };

//   // update task
//   const updateTask = async (_id: string, updates: UpdateTaskDto) => {
//     try {
//       const res = await axios.put<Task>(`http://localhost:5000/api/tasks/${_id}`, updates);
//       setTasks((prev) => prev.map((t) => (t._id === _id ? res.data : t)));
//     } catch (err: any) {
//       setError(err.message || "Error updating task");
//     }
//   };

//   // delete task
//   const deleteTask = async (_id: string) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/tasks/${_id}`);
//       setTasks((prev) => prev.filter((t) => t._id !== _id));
//     } catch (err: any) {
//       setError(err.message || "Error deleting task");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return { tasks, loading, error, addTask, updateTask, deleteTask, fetchTasks };
// }




// success

// import { useState, useEffect } from "react";
// import { Task } from "../types";

// export const useTasks = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch tasks on mount
//   useEffect(() => {
//     fetch("http://localhost:5000/tasks") // make sure port matches backend
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setTasks(data.tasks);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to fetch tasks:", err);
//         setLoading(false);
//       });
//   }, []);

//   // Add a new task
//   const addTask = async (taskData: Omit<Task, "_id" | "created_at" | "updated_at">) => {
//     try {
//       const res = await fetch("http://localhost:5000/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(taskData),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setTasks(prev => [...prev, data.task]);
//       } else {
//         console.error("Failed to add task:", data.message);
//       }
//     } catch (err) {
//       console.error("Error adding task:", err);
//     }
//   };

//   // Update task
//   const updateTask = async (taskId: string, updates: Partial<Task>) => {
//     try {
//       const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setTasks(prev => prev.map(t => (t._id === taskId ? data.task : t)));
//       } else {
//         console.error("Failed to update task:", data.message);
//       }
//     } catch (err) {
//       console.error("Error updating task:", err);
//     }
//   };

//   // Delete task
//   const deleteTask = async (taskId: string) => {
//     try {
//       const res = await fetch(`http://localhost:5000/tasks/${taskId}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) {
//         setTasks(prev => prev.filter(t => t._id !== taskId));
//       } else {
//         console.error("Failed to delete task:", data.message);
//       }
//     } catch (err) {
//       console.error("Error deleting task:", err);
//     }
//   };

//   return { tasks, loading, addTask, updateTask, deleteTask };
// };




import { useState, useEffect } from "react";
import { Task, User } from "../types";

export const useTasks = (currentUser: User | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  // ✅ Fetch tasks from backend
  const fetchTasks = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/tasks"); // adjust backend port if needed
      const data = await res.json();

      if (data.success) {
        let allTasks = data.tasks;

        // ✅ Filtering logic
        if (currentUser.role === "CEO" || currentUser.role === "Director") {
          setTasks(allTasks);
        } else {
          setTasks(allTasks.filter((t: Task) => t.assigned_to === currentUser.id));
        }
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add task
  const addTask = async (taskData: Omit<Task, "_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => [...prev, data.task]);
      } else {
        console.error("Failed to add task:", data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ Update task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? data.task : t)));
      } else {
        console.error("Failed to update task:", data.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
      } else {
        console.error("Failed to delete task:", data.message);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetchTasks };
};
