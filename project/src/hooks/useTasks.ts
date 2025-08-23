import { useState, useEffect } from 'react';
import { Task, User } from '../types';

const TASKS_STORAGE_KEY = 'beats_medical_tasks';

const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

export const useTasks = (currentUser: User | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Load tasks from localStorage
      const allTasks = loadTasksFromStorage();
      
      // Filter tasks based on user role and assignment
      let userTasks: Task[] = [];
      
      if (currentUser.role === 'CEO' || currentUser.role === 'Director') {
        // CEO and Directors can see all tasks
        userTasks = allTasks;
      } else {
        // Employees can only see tasks assigned to them
        userTasks = allTasks.filter(task => task.assigned_to === currentUser.id);
      }
      
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentUser) return;

    try {
      // Create local task object
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        assigned_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Load all tasks from storage
      const allTasks = loadTasksFromStorage();
      const updatedAllTasks = [newTask, ...allTasks];
      
      // Save to storage
      saveTasksToStorage(updatedAllTasks);
      
      // Update local state based on user role
      if (currentUser.role === 'CEO' || currentUser.role === 'Director') {
        setTasks(updatedAllTasks);
      } else {
        // For employees, only show tasks assigned to them
        const userTasks = updatedAllTasks.filter(task => task.assigned_to === currentUser.id);
        setTasks(userTasks);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Load all tasks from storage
      const allTasks = loadTasksFromStorage();
      const updatedAllTasks = allTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      );
      
      // Save to storage
      saveTasksToStorage(updatedAllTasks);
      
      // Update local state based on user role
      if (currentUser && (currentUser.role === 'CEO' || currentUser.role === 'Director')) {
        setTasks(updatedAllTasks);
      } else if (currentUser) {
        // For employees, only show tasks assigned to them
        const userTasks = updatedAllTasks.filter(task => task.assigned_to === currentUser.id);
        setTasks(userTasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Load all tasks from storage
      const allTasks = loadTasksFromStorage();
      const updatedAllTasks = allTasks.filter(task => task.id !== taskId);
      
      // Save to storage
      saveTasksToStorage(updatedAllTasks);
      
      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};