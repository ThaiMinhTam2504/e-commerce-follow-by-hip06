import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { showModel } from '../../store/app/appSlice'

const Modal = ({ children }) => {
    const dispatch = useDispatch()
    return (
        <div onClick={() => dispatch(showModel({ isShowModal: false, modalChildren: null }))}
            className='absolute inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center'>
            {children}
        </div>
    )
}

export default memo(Modal)