import { create } from 'zustand';
import { apiRequest } from '../utils/api';
import type { CategoryData } from '../utils/types';

const API_URL = import.meta.env.VITE_CATEGORIES_API_URL;
interface CategoryStore {
  categories: CategoryData[];
  fetchCategories: () => Promise<void>;
  addCategories: (
    categories: Omit<CategoryData, 'category_id'>
  ) => Promise<void>;
  deleteTask: (category_id: number) => Promise<void>;
}
export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  fetchCategories: async () => {
    const data = await apiRequest<CategoryData[]>(API_URL, { method: 'GET' });
    set({ categories: data });
  },
  addCategories: async (categories) => {
    const newTask = await apiRequest<CategoryData>(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categories),
    });
    set({ categories: [...get().categories, newTask] });
  },
  deleteTask: async (category_id) => {
    await apiRequest<void>(`${API_URL}/${category_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    set({
      categories: get().categories.filter((t) => t.category_id != category_id),
    });
  },
}));
