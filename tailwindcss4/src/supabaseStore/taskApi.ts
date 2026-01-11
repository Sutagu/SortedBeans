import { create } from 'zustand';
import type { Task, TaskFormData } from '../utils/types';
import { supabase } from '../utils/supabase';

interface SupabaseTaskStore {
  tasks: Task[];
  refreshTaskContent: number;

  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<TaskFormData, 'id'>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  editTask: (
    id: number,
    field: string,
    value: string | boolean | null
  ) => Promise<void>;
  syncTaskId: (id: number, client_id: string) => Promise<void>;
}

export const UseSupabaseTaskStore = create<SupabaseTaskStore>((set, get) => ({
  tasks: [],
  refreshTaskContent: 0,

  fetchTasks: async () => {
    if (!navigator.onLine) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    console.log(data);
    if (error) {
      console.error(error);
      return;
    }

    set({ tasks: data ?? [] });
  },
  addTask: async (task) => {
    const client_id = crypto.randomUUID();
    const { id, ...stripData } = task;
    const sanitizedData = Object.fromEntries(
      Object.entries(stripData).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ])
    );

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...sanitizedData,
        client_id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    set((state) => ({
      tasks: state.tasks.map((t) => (t.client_id === client_id ? data : t)),
    }));
  },
  deleteTask: async (id) => {
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error(error);
    }
  },
  updateTask: async (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
    const { error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', task.id);

    if (error) {
      console.error(error);
    }
  },
  editTask: async (id, field, value) => {
    set({
      tasks: get().tasks.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    });
    const { error } = await supabase
      .from('tasks')
      .update({ [field]: value })
      .eq('id', id);
    if (error) {
      console.error(error);
    }
  },
  syncTaskId: async (id, client_id) => {
    console.log(id, client_id);
  },
}));
