import React, { useState, memo } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, style, fullWidth, placeholder, isHideLabel, onKeyDown }) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleTogglePassword = () => {
        setShowPassword(!showPassword)
    }
    return (
        <div className={clsx('flex flex-col relative mb-2', fullWidth && 'w-full')}>
            {!isHideLabel && value?.trim() !== '' &&
                <label className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1'
                    htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                // type={type || 'text'} cũ
                type={type === 'password' && showPassword ? 'text' : type || 'text'}
                className={clsx('px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none', style)}
                placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}
                onKeyDown={onKeyDown}
            />

            {type === 'password' && (
                <span
                    className="absolute right-2 top-1/2 transform -translate-y-1/3 cursor-pointer text-gray-500"
                    onClick={handleTogglePassword}
                >
                    {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
            )}


            {invalidFields?.some(el => el.name === nameKey) &&
                <small className='text-main italic'>{invalidFields
                    .find(el => el.name === nameKey)?.mes}</small>}
        </div>
    )
}

export default memo(InputField)