import { create } from 'zustand';
import { apiRequest } from '../utils/api';
import type { Task, TaskFormData } from '../utils/types';

const API_URL = import.meta.env.VITE_TASK_API_URL;
interface TaskStore {
  tasks: Task[];
  taskFormData: TaskFormData[];
  refreshTaskContent: number;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<TaskFormData, 'id'>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (task: Omit<TaskFormData, 'id'>, EditId: number) => Promise<void>;
  editTaskDate: (id: number, assignedDate: string | null) => Promise<void>;
  editTaskCompleted: (id: number, completed: boolean) => Promise<void>;
  editTaskEstTime: (id: number, est_time: number) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],
  refreshTaskContent: 0,
  fetchTasks: async () => {
    const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
    set({ tasks: data });
  },
  editTaskEstTime: async (id, est_time) => {
    if (est_time < 1440) {
      await apiRequest<void>(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ est_time }),
      });
      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, est_time } : t)),
      });
    }
  },
  editTaskDate: async (id, assigned_date) => {
    if (assigned_date != null) {
      await apiRequest<void>(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigned_date }),
      });
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, assigned_date } : t
        ),
      });
    }
  },
  editTaskCompleted: async (id, completed) => {
    await apiRequest<void>(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    set({
      tasks: get().tasks.map((t) => (t.id === id ? { ...t, completed } : t)),
    });
  },
  addTask: async (task) => {
    const newTask = await apiRequest<TaskFormData>(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    set((state) => ({
      taskFormData: [...get().taskFormData, newTask],
      refreshTaskContent: state.refreshTaskContent + 1,
    }));
  },
  updateTask: async (task, EditId) => {
    const editTask = await apiRequest<TaskFormData>(`${API_URL}/${EditId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    set({ taskFormData: [...get().taskFormData, editTask] });
  },
  deleteTask: async (id) => {
    await apiRequest<void>(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    set({ tasks: get().tasks.filter((t) => t.id != id) });
  },
}));
