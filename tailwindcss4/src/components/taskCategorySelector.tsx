//React and icons
import { CgRemove, CgAdd, CgPen } from 'react-icons/cg';
import { useEffect, useState, useRef } from 'react';
//Components
import ModifyTask from './ModifyTask';
//Hooks and utils
import { ComponentMode } from '../utils/componentMode';
import {
  useReset,
  useGetCategoryData,
  useSetCategoryData,
  useGetPageRefresh,
  useSetPageRefresh,
  useGetEditId,
} from '../utils/useStateOrganiser';
import { useCategoryStore } from '../hooks/categoryStoreHook';
//Types

const TaskCategorySelector = () => {
  //API Hook
  const { categories, fetchCategories } = useCategoryStore();
  //Private variables
  const [mode, setMode] = useState<ComponentMode>(ComponentMode.DEFAULT);
  const [input, setInput] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);
  //Public variables
  const resetData = useReset();
  const category = useGetCategoryData();
  const setCategory = useSetCategoryData();
  const refreshPage = useGetPageRefresh();
  const setPageRefresh = useSetPageRefresh();
  const EditId = useGetEditId();

  //Helpers
  const toggleMode = (targetMode: ComponentMode) => {
    setMode((prev) =>
      prev == targetMode ? ComponentMode.DEFAULT : targetMode
    );
  };
  const resetStateFields = () => {
    resetData();
    toggleMode(ComponentMode.DEFAULT);
    setInput('');
  };

  const addTaskCategory = async (name: string) => {
    const payload = { name };
    try {
      const res = await fetch('http://localhost:5000/api/task_categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create category');
      const newCategory = await res.json();
      console.log('Created category:', newCategory);
    } catch (err) {
      console.error(err);
    }
    resetStateFields();
    setPageRefresh();
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/task_categories/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete:', error.error || res.statusText);
        return;
      }
      const category = categories[0];
      if (category) setCategory(category);
      resetStateFields();
      setPageRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };
  useEffect(() => {
    fetchCategories();
    if (EditId != 0) setMode(ComponentMode.EDIT_TASK);
    else {
      setMode(ComponentMode.DEFAULT);
    }
    console.log(EditId);
  }, [refreshPage, EditId]);
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
            onClick={() => deleteCategory(category.category_id)}
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
            onClick={() =>
              mode != ComponentMode.ADD_TASK
                ? setMode(ComponentMode.ADD_TASK)
                : setMode(ComponentMode.DEFAULT)
            }
          />
        </div>
      </div>
      <span
        className={`p-5 transition-all bg-white/10 gap-4 
          ${mode == ComponentMode.ADD_CATEGORY ? 'flex' : 'hidden'} `}
      >
        <input
          type="text"
          name="name"
          placeholder="Add category name"
          autoComplete="off"
          maxLength={30}
          className="w-7/10 border-b-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="w-3/10 text-sm accent rounded-md py-2 hover:font-semibold hover:cursor-pointer transition-colors "
          onClick={() => addTaskCategory(input)}
        >
          Add Category
        </button>
        <button
          className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
          onClick={() => resetStateFields()}
        >
          Cancel
        </button>
      </span>
      <ModifyTask mode={mode} setMode={setMode} />
    </div>
  );
};
export default TaskCategorySelector;
