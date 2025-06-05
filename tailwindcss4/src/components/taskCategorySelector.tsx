type Props = {
    selected: string
    onChange: (value: string) => void
}

const TaskCategorySelector = ({ selected, onChange} : Props) =>{
    const categories = ['Tasks', 'Day', 'Shopping', 'Assignments']

    return(
        <select
            value = {selected}
            onChange ={(e) => onChange(e.target.value)}
            className="w-full h-[7.5%] p-2"
        >
            {categories.map((cat) => (
                <option key = {cat} value ={cat} className='p-2 bg-[#894931] '>
                    {cat}
                </option>    
            ))}
        </select>
    )

}
export default TaskCategorySelector