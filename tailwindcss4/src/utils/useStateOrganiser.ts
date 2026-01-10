import { create } from 'zustand';
import type { CategoryData, Task } from './types';
import type { User } from '@supabase/supabase-js';
//Default values
const defaultTaskFormData: Task = {
  id: -1,
  client_id: '',
  title: '',
  est_time: 0,
  category_id: 1,
  assigned_date: '',
  description: '',
  completed: false,
  created_at: '',
};
const defaultCategory: CategoryData = {
  category_id: 0,
  name: 'NULL',
};

interface AppState {
  //Interfaces
  taskFormData: Task;
  categoryData: CategoryData;
  uiTheme: string;
  gitHubUser: User | null;
  //TaskFormData functons
  setTaskFormData: (data: Task) => void;
  setSpecificTaskField: <K extends keyof Task>(
    field: K,
    value: Task[K]
  ) => void;

  reset: () => void;

  //SetCategory functions
  setCategoryData: (data: CategoryData) => void;
  //Theme functions
  setTheme: (newTheme: string) => void;
  //GithubUser
  setGitHubUser: (user: User | null) => void;
}

export const useStateOrganiser = create<AppState>((set) => ({
  taskFormData: defaultTaskFormData,
  uiTheme: 'default',
  categoryData: defaultCategory,
  gitHubUser: null,
  //TaskFormData functions
  setTaskFormData: (data) => set({ taskFormData: data }),
  setSpecificTaskField: (field, value) =>
    set((state) => ({
      taskFormData: { ...state.taskFormData, [field]: value },
    })),

  //Set category data
  setCategoryData: (data) => set({ categoryData: data }),
  //reset all
  reset: () => {
    set({ taskFormData: defaultTaskFormData });
  },
  //setUiTheme function
  setTheme: (newTheme) => set({ uiTheme: newTheme }),

  //User auth
  setGitHubUser: (user) => set({ gitHubUser: user }),
}));

export const useSetTaskFormData = () =>
  useStateOrganiser((state) => state.setTaskFormData);
export const useGetTaskFormData = () =>
  useStateOrganiser((state) => state.taskFormData);

export const useSetSpecificTaskField = () =>
  useStateOrganiser((state) => state.setSpecificTaskField);

export const useReset = () => useStateOrganiser((state) => state.reset);

export const useSetCategoryData = () =>
  useStateOrganiser((state) => state.setCategoryData);
export const useGetCategoryData = () =>
  useStateOrganiser((state) => state.categoryData);

export const useSetTheme = () => useStateOrganiser((state) => state.setTheme);

export const useGitHubUser = () =>
  useStateOrganiser((state) => state.setGitHubUser);
export const useGetUser = () => useStateOrganiser((state) => state.gitHubUser);
