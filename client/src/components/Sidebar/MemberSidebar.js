import React, { memo, Fragment, useState } from 'react'
import avatar from 'assets/default_avatar.png'
import { memberSidebar } from 'utils/contants'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai'
import { useSelector } from 'react-redux'

const activedStyle = 'px-4 py-2 flex items-center gap-2  bg-blue-500 '
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-blue-100'

const MemberSidebar = () => {
    const [actived, setActived] = useState([])
    const { current } = useSelector(state => state.user)
    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])

    }
    return (
        <div className=' bg-white h-full py-4 w-[250px] flex-none' >
            <div className=" absolute top-0 right-0 h-full w-[6px] rounded-tr-2xl rounded-br-2xl bg-gradient-to-b from-pink-500 via-blue-500 to-green-400 animate-animated-gradient"
                style={{ backgroundSize: '100% 200%' }}
            ></div>
            <div className='w-full flex flex-col items-center justify-center p-4'>
                <img src={current?.avatar || avatar} alt='logo' className='w-[150px] h-[150px] object-cover rounded-full' />
                <small className='font-medium text-[20px]'>{`${current?.lastname} ${current?.firstname}`}</small>
            </div>
            <div>
                {memberSidebar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' && <NavLink
                            to={el.path}
                            className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                        >
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>}
                        {el.type === 'PARENT' && <div onClick={() => handleShowTabs(+el.id)} className=' flex flex-col   '>
                            <div className='flex items-center justify-between  px-4 py-2 hover:bg-blue-100 cursor-pointer'>
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {!actived.some(id => id === +el.id) ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
                            </div>
                            {actived.some(id => id === +el.id) &&
                                <div className='flex flex-col'>
                                    {el.submenu.map(item => (
                                        <NavLink
                                            onClick={e => e.stopPropagation()}
                                            className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, ' pl-10')}
                                            key={item.text}
                                            to={item.path}>
                                            {item.text}
                                        </NavLink>
                                    ))}
                                </div>}
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(MemberSidebar)