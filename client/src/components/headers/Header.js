import React, { Fragment, memo, useEffect, useState } from 'react'
import logo from 'assets/logo.png'
import icons from 'utils/icons'
import { Link } from 'react-router-dom'
import path from 'utils/path'
import { useSelector } from 'react-redux'
import { logout } from 'store/user/userSlice'
import withBaseComponent from 'hocs/withBaseComponent'
import { showCart } from 'store/app/appSlice'


const Header = ({ dispatch }) => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    const [isShowOptions, setIsShowOptions] = useState(false)
    // console.log('Redux state - current:', current);
    // console.log('Redux state - isLoggedIn:', isLoggedIn);
    const { RiPhoneFill, MdEmail, BsHandbagFill,
        FaUserCircle, } = icons

    useEffect(() => {
        const handleClickOutside = (e) => {
            const profile = document.getElementById('profile')
            profile && !profile.contains(e.target) && setIsShowOptions(false)

        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])
    return (
        <div className=' w-main h-[110px] py-[35px] flex justify-between'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt='logo' className='w-[234px] object-contain' />
            </Link>

            <div className='flex text-[13px] '>
                <div className='flex px-6 border-r flex-col items-center'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className='flex px-6 border-r flex-col items-center'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold'>SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {/* {current && <Fragment>
                    <div className='cursor-pointer flex px-6 border-r items-center justify-center gap-2'>
                        <BsHandbagFill color='red' />
                        <span>0 items</span>
                    </div>
                    <Link
                        to={+current?.role === 0 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                        className='cursor-pointer- flex px-6 justify-center items-center gap-2'>
                        <FaUserCircle color='red' />
                        <span>Profile</span>
                    </Link>
                </Fragment>} */}

                {isLoggedIn && current && (
                    <Fragment>
                        <div onClick={() => dispatch(showCart())} className='cursor-pointer flex px-6 border-r items-center justify-center gap-2'>
                            <BsHandbagFill color='red' />
                            <span>{`${current?.cart?.length || 0} items`}</span>
                        </div>
                        <div
                            className='cursor-pointer- flex px-6 justify-center items-center gap-2 relative'
                            onClick={() => setIsShowOptions(prev => !prev)}
                            id='profile'
                        >
                            <FaUserCircle color='red' />
                            <span>Profile</span>
                            {isShowOptions && (<div onClick={(e) => e.stopPropagation()} className='flex flex-col absolute top-full left-[16px] bg-gray-100 border py-2 min-w-[150px]'>
                                <Link className='w-full p-2 hover:bg-sky-100' to={`/${path.MEMBER}/${path.PERSONAL}`}>
                                    Personal
                                </Link>
                                {+current?.role === 0 && <Link className='w-full p-2 hover:bg-sky-100'
                                    to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                                    ADMIN WORKSPACE
                                </Link>}
                                <span
                                    onClick={() => dispatch(logout())}
                                    className='w-full p-2 hover:bg-sky-100'>Logout</span>
                            </div>)}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Header))