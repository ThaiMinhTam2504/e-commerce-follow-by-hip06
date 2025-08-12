import { Button, Loader } from 'components'
import InputForm from 'components/inputs/inputForm'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import avatar from 'assets/default_avatar.png'
import { apiUpdateCurrent } from 'apis'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncAction';
import { showModel } from 'store/app/appSlice'


const Personal = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm()
    const { current } = useSelector(state => state.user)
    const [previewAvatar, setPreviewAvatar] = useState(null)
    const avatarFile = watch('avatar')
    useEffect(() => {
        if (avatarFile && avatarFile.length > 0 && avatarFile[0] instanceof File) {
            const file = avatarFile[0]
            // Kiểm tra đuôi file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a JPEG or PNG image.');
                return;
            }
            // Kiểm tra trùng ảnh (so sánh tên và size)
            if (current?.avatar && current?.avatar.includes(file.name)) {
                toast.error('File with the same name already exists.');
                return;
            }
            setPreviewAvatar(URL.createObjectURL(file))
        } else {
            setPreviewAvatar(null)
        }
    }, [avatarFile, current])
    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            email: current?.email,
            mobile: current?.mobile,
            avatar: current?.avatar,
            address: current?.address
        })
        setPreviewAvatar(null)
    }, [current, reset])
    const handleUpdateInfo = async (data) => {
        // console.log(Object.entries(data))
        const formData = new FormData()
        // console.log(data.avatar)
        if (data.avatar && data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]) // nếu có ảnh thì thêm vào formData
        }
        delete data.avatar // nếu không có ảnh thì xóa đi
        for (let i of Object.entries(data)) formData.append(i[0], i[1])
        dispatch(showModel({ isShowModal: true, modalChildren: <Loader /> }))
        const response = await apiUpdateCurrent(formData)
        dispatch(showModel({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            dispatch(getCurrent())
            toast.success(response.mes)
        } else {
            console.log(response)
            toast.error(response.mes || 'Something went wrong!')
        }

    }
    return (
        <div className='w-full relative px-4 '>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                Personal Information
            </header>
            <form onSubmit={handleSubmit(handleUpdateInfo)} className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
                <InputForm
                    label={'First Name'}
                    id='firstname'
                    register={register}
                    errors={errors}
                    validate={{ required: 'First name is required' }}
                />
                <InputForm
                    label={'Last Name'}
                    id='lastname'
                    register={register}
                    errors={errors}
                    validate={{ required: 'Last name is required' }}
                />
                <InputForm
                    label={'Email Address'}
                    id='email'
                    register={register}
                    errors={errors}
                    validate={{
                        required: 'Email address is required', pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email format'
                        }
                    }}
                />
                <InputForm
                    label={'Mobile Number'}
                    id='mobile'
                    register={register}
                    errors={errors}
                    validate={{
                        required: 'Mobile number is required', pattern: {
                            value: /^[\+]?[()]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
                            message: 'Invalid mobile number format'
                        }
                    }}
                />
                <InputForm
                    label={'Address'}
                    id='address'
                    register={register}
                    errors={errors}
                    validate={{ required: 'Address is required' }}
                />
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Role:</span>
                    <span>{+current?.role === 0 ? 'Admin' : 'User'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Created At:</span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div>

                <div className='flex gap-2 flex-col'>
                    <span className='font-medium'>Avatar:</span>

                    {previewAvatar
                        ? <label htmlFor='file'>
                            <img src={previewAvatar} alt='Avatar' className='w-20 h-20 object-cover rounded-full ml-8' />
                        </label>
                        : <label htmlFor='file'>
                            <img src={current?.avatar || avatar} alt='Avatar' className='w-20 h-20 object-cover rounded-full ml-8' />
                        </label>}
                    <input id='file'
                        type='file'
                        hidden {...register('avatar')}
                        accept='.jpg,.jpeg,.png,image/jpeg,image/png'
                    />
                </div>

                {isDirty && (<div className='w-full flex justify-end'>
                    <Button type='submit'>Update Information</Button>
                </div>)}
            </form>
        </div>
    )
}

export default Personal