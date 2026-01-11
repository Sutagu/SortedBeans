//React and icons
import { CgRemove, CgAdd, CgPen } from 'react-icons/cg';
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
//Components
const ModifyTask = lazy(() => import('./ModifyTask'));
const ModifyCategory = lazy(() => import('./ModifyCategory'));
//Hooks and utils
import { ComponentMode } from '../utils/componentMode';
import {
  useGetCategoryData,
  useSetCategoryData,
  useGetTaskFormData,
  useReset,
  useStateOrganiser,
} from '../utils/useStateOrganiser';
import { UseSupabaseCategoryStore } from '../supabaseStore/categoryApi';
const TaskCategorySelector = () => {
  //API Hook
  const { categories, FetchCategories, DeleteCategory } =
    UseSupabaseCategoryStore();
  //Private variables
  const [mode, setMode] = useState<ComponentMode>(ComponentMode.DEFAULT);
  const selectRef = useRef<HTMLSelectElement>(null);
  //Public variables
  const category = useGetCategoryData();
  const setCategory = useSetCategoryData();
  const taskFormData = useGetTaskFormData();
  const resetFormData = useReset();
  const { gitHubUser } = useStateOrganiser();
  useEffect(() => {
    if (categories.length == 0) {
      console.log('Fetching Categories');
      FetchCategories();
    }
    if (taskFormData.id != -1) setMode(ComponentMode.EDIT_TASK);
    else setMode(ComponentMode.DEFAULT);
  }, [
    taskFormData.id,
    categories,
    FetchCategories,
    gitHubUser?.user_metadata.user_name,
  ]);
  return (
    <div className="flex-col flex justify-center text-text">
      <div className="p-2 w-full flex items-center justify-between text-lg">
        <select
          ref={selectRef}
          value={category.category_id}
          aria-label="category selector"
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const category = categories.find(
              (cat) => cat.category_id === selectedId
            );
            if (category) setCategory(category);
          }}
          className="w-7/10 h-full shrink p-2 "
        >
          <option value="" hidden>
            Choose a Task...
          </option>
          {categories.map((cat) => (
            <option
              key={cat.category_id}
              value={cat.category_id}
              className="p-2 bg-accent-dark"
            >
              {cat.name}
            </option>
          ))}
        </select>
        <div className=" text-xl flex items-center justify-end-safe gap-1">
          <p
            className={`text-xs text-nowrap hover:text-red-400 cursor-pointer ${
              mode == ComponentMode.DELETE_CATEGORY ? 'block' : 'hidden'
            }`}
            onClick={() => {
              DeleteCategory(category.category_id);
              setMode(ComponentMode.DEFAULT);
            }}
          >
            Delete {category.name} ?
          </p>
          <CgRemove
            title="Delete Current Category"
            className="cursor-pointer hover:text-accent transition-colors"
            onClick={() =>
              mode != ComponentMode.DELETE_CATEGORY
                ? setMode(ComponentMode.DELETE_CATEGORY)
                : setMode(ComponentMode.DEFAULT)
            }
          />
          <CgAdd
            className={`cursor-pointer hover:text-accent transition-colors ${
              mode == ComponentMode.ADD_CATEGORY ? 'text-accent' : ''
            }`}
            onClick={() =>
              mode != ComponentMode.ADD_CATEGORY
                ? setMode(ComponentMode.ADD_CATEGORY)
                : setMode(ComponentMode.DEFAULT)
            }
          />
          <CgPen
            className={`cursor-pointer hover:text-accent transition-colors ${
              mode == ComponentMode.ADD_TASK ? 'text-accent' : ''
            }`}
            onClick={() => {
              if (mode != ComponentMode.ADD_TASK)
                setMode(ComponentMode.ADD_TASK);
              else setMode(ComponentMode.DEFAULT);
              resetFormData();
            }}
          />
        </div>
      </div>
      <Suspense>
        <ModifyCategory mode={mode} setMode={setMode} />
        <ModifyTask mode={mode} setMode={setMode} />
      </Suspense>
    </div>
  );
};
export default TaskCategorySelector;
