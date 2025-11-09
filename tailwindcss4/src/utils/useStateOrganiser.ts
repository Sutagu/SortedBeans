import { create } from 'zustand';
import type { TaskFormData, EditingTask, CategoryData } from './types';
//Default values
const defaultTaskFormData: TaskFormData = {
  title: '',
  est_time: 0,
  category_id: 1,
  assigned_date: '',
  description: '',
};
const defaultCategory: CategoryData = {
  category_id: 0,
  name: 'NULL',
};

interface AppState {
  //Interfaces
  taskFormData: TaskFormData;
  editTask: EditingTask;
  categoryData: CategoryData;
  refreshPage: number;
  uiTheme: string;

  //TaskFormData functons
  setTaskFormData: (data: TaskFormData) => void;
  setTaskField: <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => void;

  //editTask functions
  setEditId: (newId: number) => void;
  reset: () => void;

  //SetCategory functions
  setCategoryData: (data: CategoryData) => void;
  //Refresh functions
  setPageRefresh: () => void;

  //Theme functions
  setTheme: (newTheme: string) => void;
}

export const useStateOrganiser = create<AppState>((set) => ({
  taskFormData: defaultTaskFormData,
  editTask: { id: 0 },
  refreshPage: 0,
  uiTheme: 'default',
  categoryData: defaultCategory,

  //TaskFormData functions
  setTaskFormData: (data) => set({ taskFormData: data }),
  setTaskField: (field, value) =>
    set((state) => ({
      taskFormData: { ...state.taskFormData, [field]: value },
    })),

  //Edit Task functions
  setEditId: (newId) =>
    set((state) => ({
      editTask: { ...state.editTask, id: newId },
    })),
  //Set category data
  setCategoryData: (data) => set({ categoryData: data }),
  //reset all
  reset: () => {
    set({ taskFormData: defaultTaskFormData });
    set({ editTask: { id: 0 } });
  },

  //setPageRefresh functions
  setPageRefresh: () =>
    set((state) => ({ refreshPage: state.refreshPage + 1 })),

  //setUiTheme function
  setTheme: (newTheme) => set({ uiTheme: newTheme }),
}));

export const useSetTaskFormData = () =>
  useStateOrganiser((state) => state.setTaskFormData);
export const useGetTaskFormData = () =>
  useStateOrganiser((state) => state.taskFormData);

export const useSetTaskField = () =>
  useStateOrganiser((state) => state.setTaskField);

export const useGetEditId = () =>
  useStateOrganiser((state) => state.editTask.id);
export const useSetEditId = () => useStateOrganiser((state) => state.editTask);

export const useReset = () => useStateOrganiser((state) => state.reset);

export const useSetCategoryData = () =>
  useStateOrganiser((state) => state.setCategoryData);
export const useGetCategoryData = () =>
  useStateOrganiser((state) => state.categoryData);

export const useSetPageRefresh = () =>
  useStateOrganiser((state) => state.setPageRefresh);
export const useGetPageRefresh = () =>
  useStateOrganiser((state) => state.refreshPage);

export const useSetTheme = () => useStateOrganiser((state) => state.setTheme);
