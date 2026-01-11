import { useState } from 'react';
import { UseSupabaseCategoryStore } from '../supabaseStore/categoryApi';
import { ComponentMode } from '../utils/componentMode';
interface Props {
  mode: ComponentMode;
  setMode: React.Dispatch<React.SetStateAction<ComponentMode>>;
}
const ModifyCategory = ({ mode, setMode }: Props) => {
  //API Hook
  const { AddCategories } = UseSupabaseCategoryStore();
  //Private variables
  const [input, setInput] = useState('');
  return (
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
        onClick={() => {
          AddCategories(input);
          setMode(ComponentMode.DEFAULT);
        }}
      >
        Add Category
      </button>
      <button
        className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
        onClick={() => setMode(ComponentMode.DEFAULT)}
      >
        Cancel
      </button>
    </span>
  );
};
export default ModifyCategory;
