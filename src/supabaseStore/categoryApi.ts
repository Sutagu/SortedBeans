import { create } from 'zustand';
import type { CategoryData } from '../utils/types';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';
import { useStateOrganiser } from '../utils/useStateOrganiser';
interface SupabaseCategoryStore {
  categories: CategoryData[];
  FetchCategories: () => Promise<void>;
  // AddCategories: (name: string) => Promise<void>;
  // DeleteCategory: (category_id: number) => Promise<void>;
  user: User | null;
}
//Disabled Add and Delete category functions to keep data coherent and easier cascades on routine delete
export const UseSupabaseCategoryStore = create<SupabaseCategoryStore>(
  (set) => ({
    categories: [],
    user: useStateOrganiser.getState().gitHubUser,

    FetchCategories: async () => {
      const { data, error } = await supabase
        .from('task_categories')
        .select('*')
        .order('name');
      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
      set({ categories: data ?? [] });
    },
    // AddCategories: async (name) => {
    //   const { data, error } = await supabase
    //     .from('task_categories')
    //     .insert({ name })
    //     .select()
    //     .single();
    //   if (error) {
    //     console.error(error);
    //     return;
    //   }
    //   set((state) => ({ categories: [...state.categories, data] }));
    // },
    // DeleteCategory: async (category_id) => {
    //   set({
    //     categories: get().categories.filter(
    //       (c) => c.category_id != category_id
    //     ),
    //   });
    //   const { error } = await supabase
    //     .from('task_categories')
    //     .delete()
    //     .eq('category_id', category_id);
    //   if (error) {
    //     console.error(error);
    //   }
    // },
  })
);
