import { BiEdit } from "react-icons/bi"; 
type Props = {
    selected: string
    onChange: (value: string) => void
}

const TaskCategorySelector = ({ selected, onChange} : Props) =>{
    const categories = ['Tasks', 'Day', 'Shopping', 'Assignments']

    return(
        <div className="w-full h-[7.5%] flex items-center justify-between">
        <select
            value = {selected}
            onChange ={(e) => onChange(e.target.value)}
            className="w-[70%] h-full p-2"
        >
            {categories.map((cat) => (
                <option key = {cat} value ={cat} className='p-2 bg-[#894931]'>
                    {cat}
                </option>    
            ))}
        </select>
        <BiEdit className="w-[10%] text-xl pr-2"/>
        </div>
       
    )

}
export default TaskCategorySelector