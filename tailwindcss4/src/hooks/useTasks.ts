import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
const taskUrl = import.meta.env.VITE_TASK_API_URL;

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}
interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}

export function useTasks() {
  const [tasks, SetTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    const data = await apiRequest<Task[]>(taskUrl, {
      method: 'GET',
    });
    SetTasks(data);
  }

  async function addTask(payload: TaskFormData[]) {
    await apiRequest(taskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchTasks();
  }

  async function deleteTask(id: number) {
    await apiRequest(`${taskUrl}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    await fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, addTask, deleteTask };
}
