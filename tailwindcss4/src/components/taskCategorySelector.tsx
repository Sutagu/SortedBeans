//React
import { CgRemove, CgAdd, CgPen, CgTrash } from 'react-icons/cg';
import { useEffect, useState, useRef } from 'react';
//Hooks and utils
import { ComponentMode } from '../utils/componentMode';
import {
  useReset,
  useGetTaskFormData,
  useSetTaskField,
  useGetCategoryData,
  useSetCategoryData,
  useGetPageRefresh,
  useSetPageRefresh,
  useGetEditId,
} from '../utils/useStateOrganiser';
//Types
import type { CategoryData } from '../utils/types';

const TaskCategorySelector = () => {
  //Private variables
  const [mode, setMode] = useState<ComponentMode>(ComponentMode.DEFAULT);
  const [categ, setCateg] = useState<CategoryData[]>([]);
  const [input, setInput] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);
  //Public variables
  const resetData = useReset();
  const taskFormData = useGetTaskFormData();
  const setTaskField = useSetTaskField();
  const category = useGetCategoryData();
  const setCategory = useSetCategoryData();
  const refreshPage = useGetPageRefresh();
  const setPageRefresh = useSetPageRefresh();
  const EditId = useGetEditId();

  //Helpers
  function toDatetimeLocalString(isoDate: string): string {
    const date = new Date(isoDate);
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().slice(0, 16);
  }
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
  //Handles change in form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numericFields = new Set(['est_time', 'category_id']);
    const newValue = numericFields.has(name) ? Number(value) : value;
    setTaskField(name as keyof typeof taskFormData, newValue);
  };

  const addTaskFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    //Handles payload assigned or non-assigned Date and Time
    const payload = {
      ...taskFormData,
      assigned_date:
        taskFormData.assigned_date != '' ? taskFormData.assigned_date : null,
    };
    if (mode == ComponentMode.ADD_TASK) {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create task');
        const newTask = await res.json();
        console.log('Created Task:', newTask);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tasks/update/${EditId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error('Failed to update Task');
        const newTask = await res.json();
        console.log('Updated Task:', newTask);
      } catch (err) {
        console.error(err);
      }
    }

    resetStateFields();
    setPageRefresh();
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
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete:', error.error || res.statusText);
        return;
      }

      resetStateFields();
      setPageRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
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
      const category = categ[0];
      if (category) setCategory(category);
      resetStateFields();
      setPageRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };
  useEffect(() => {
    fetch('http://localhost:5000/api/task_categories')
      .then((res) => res.json())
      .then((data: CategoryData[]) => {
        setCateg(data);
      })
      .catch((err) => {
        console.error('Error fetching categories', err);
      });
    if (EditId != 0) setMode(ComponentMode.EDIT_TASK);
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
            const category = categ.find(
              (cat) => cat.category_id === selectedId
            );
            if (category) setCategory(category);
          }}
          className="w-7/10 h-full shrink p-2 "
        >
          <option value="" hidden>
            Choose a Task...
          </option>
          {categ.map((cat) => (
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

      <form
        onSubmit={addTaskFunction}
        className={`p-5 transition-all bg-white/10 gap-4 ${
          mode == ComponentMode.ADD_TASK || mode == ComponentMode.EDIT_TASK
            ? 'flex flex-col'
            : 'hidden'
        }`}
      >
        <input
          type="text"
          name="title"
          placeholder="Add Title"
          maxLength={30}
          value={taskFormData.title}
          onChange={handleChange}
          className="border-b-1 py-2"
          required
        />
        <span className="py-2 text-sm flex justify-between items-center">
          <input
            type="datetime-local"
            name="assigned_date"
            value={
              taskFormData.assigned_date
                ? toDatetimeLocalString(taskFormData.assigned_date)
                : ''
            }
            onChange={handleChange}
            className="bg-black/20 w-4/10 rounded-lg p-2 text-gray-light"
          />
          <p className="w-6/10">Estimated Time (Minutes):</p>
          <input
            type="number"
            name="est_time"
            value={taskFormData.est_time}
            onChange={handleChange}
            className="w-1/10 text-gray-light"
          />
        </span>
        <textarea
          name="description"
          placeholder="Description..."
          value={taskFormData.description}
          onChange={handleChange}
          maxLength={100}
          className="h-full text-gray-light"
        ></textarea>
        <select
          name="category_id"
          value={taskFormData.category_id}
          onChange={handleChange}
          className="w-7/10"
        >
          {categ.map((cat) => (
            <option
              key={cat.category_id}
              value={cat.category_id}
              className="p-2 text-white bg-gray-500"
            >
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex gap-4">
          <button
            type="submit"
            className={`cursor-pointer transition-colors bg-accent rounded-md py-2 hover:bg-accent-dark ${
              mode == ComponentMode.ADD_TASK ? 'grow' : 'hidden'
            }`}
          >
            Add Task
          </button>
          <button
            type="submit"
            className={`transition-colors bg-accent rounded-md py-2 cursor-pointer hover:bg-accent-dark ${
              mode == ComponentMode.EDIT_TASK ? 'grow' : 'hidden'
            }`}
          >
            Edit Task
          </button>
          <CgTrash
            title="Delete task"
            className={`p-2 h-full w-auto secondary rounded-lg text-xl hover:bg-red-600! transition-colors ${
              mode == ComponentMode.EDIT_TASK ? 'block' : 'hidden'
            }`}
            onClick={() => deleteTask(EditId)}
          />
          <button
            className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
            onClick={() => resetStateFields()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default TaskCategorySelector;
