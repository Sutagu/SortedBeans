import { BiEdit } from "react-icons/bi"; 
import { useEffect, useState } from "react";
type Props = {
  selected: { id: number; name: string };
  onChange: (category: { id: number; name: string }) => void;
};


interface Categ {
  id : number;
  name: string;
}


const TaskCategorySelector = ({ selected, onChange} : Props) =>{
    const [categ, setCateg] = useState<Categ[]>([]);
    const HandleCategoryChange = (value : string) : {id: number; name: string} =>{
      const matchId = categ.find(cat => cat.name === value)?.id||0;
      const updatedCategory = {
        id: matchId,
        name: value
      };
      return updatedCategory;
    }

    useEffect(() =>{
    fetch('http://localhost:5000/api/task_categories')
      .then(res => res.json())
      .then((data : Categ[]) =>{
        console.log('Fetched Categories:', data);
        setCateg(data);
      })
      .catch(err => {
        console.error('Error fetching categories', err);
      });
    }, []);
    return(
        <div className="w-full h-[7.5%] flex items-center justify-between">
        <select
            value = {selected.name}
            onChange ={e => onChange(HandleCategoryChange(e.target.value))}
            className="w-[70%] h-full p-2"
        >
            {categ.map((cat) => (
                <option key = {cat.id} value ={cat.name} className='p-2 bg-[#894931]'>
                    {cat.name}
                </option>    
            ))}
        </select>
        <BiEdit className="w-[10%] text-xl pr-2"/>
        </div>
       
    )

}
export default TaskCategorySelector;