import axios from 'axios';
import { Task } from '../types';

const BASE_URL = 'http://localhost:5000/tasks'; // your Express server URL

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.tasks;
};

export const createTask = async (taskData: Omit<Task, '_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const res = await axios.post(BASE_URL, taskData);
  return res.data.task;
};

export const updateTask = async (
  id: string,
  taskData: Omit<Task, '_id' | 'created_at' | 'updated_at'>
): Promise<Task> => {
  const res = await axios.put(`${BASE_URL}/${id}`, taskData);
  return res.data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
