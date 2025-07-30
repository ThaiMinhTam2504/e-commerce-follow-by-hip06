import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { createSlug } from 'utils/helper'
import { useSelector } from 'react-redux'

const Sidebar = () => {
    //Cách mới
    const { categories } = useSelector(state => state.app)


    //Cách cũ.
    // const [categories, setCategories] = useState(null)
    // const fetchCategories = async () => {
    //     const response = await apiGetCategories()
    //     if (response.success) setCategories(response.categories)
    // }
    // useEffect(() => {
    //     fetchCategories()
    // }, [])
    // console.log(categories)
    return (
        <div className='flex flex-col border'>
            {categories?.map(el => (
                <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    // to={`/${createSlug(el.title)}`}
                    className={({ isActive }) => isActive
                        ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
                        : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    )
}

export default memo(Sidebar)