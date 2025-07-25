import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, InputForm, Loader } from 'components'
import { getBase64 } from 'utils/helper'
import { toast } from 'react-toastify'
import { apiAddVariant } from 'apis/product'
import { useDispatch } from 'react-redux'
import { showModel } from 'store/app/appSlice'


const CustomizeVariants = ({ customzieVariants, setCustomizeVariants, render }) => {
    const dispatch = useDispatch()
    const [preview, setPreview] = useState({
        thumb: '',
        images: []
    })
    const { handleSubmit, register, formState: { errors }, reset, watch } = useForm()
    useEffect(() => {
        reset({
            title: customzieVariants?.title || '',
            price: customzieVariants?.price || '',
            color: customzieVariants?.color || '',
        })
    }, [customzieVariants])



    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])
    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'))
    }, [watch('images')])


    const handlePreviewThumb = async (file) => {
        if (!file) return
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }


    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                toast.warning('Only PNG, JPEG, and JPG files are allowed.')
                return
            }
            const base64 = await getBase64(file)
            imagesPreview.push(base64)
        }
        if (imagesPreview.length > 0) setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    const handleAddVariant = async (data) => {
        if (!customzieVariants?._id) {
            toast.error('Product ID is missing!');
            return;
        }

        // Kiểm tra trùng màu với các variant đã có
        if (
            Array.isArray(customzieVariants.variants) &&
            customzieVariants.variants.some(variant => variant.color?.toLowerCase() === data.color?.toLowerCase())
        ) {
            toast.warning('This color variant already exists!');
            return;
        }

        if (data.color === customzieVariants?.color) {
            toast.warning('Variant color must be different from the original product color.')
            return
        } else {
            const formData = new FormData()
            for (let i of Object.entries(data)) formData.append(i[0], i[1])
            if (data.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispatch(showModel({ isShowModal: true, modalChildren: <Loader /> }))
            const response = await apiAddVariant(formData, customzieVariants._id)
            dispatch(showModel({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                setCustomizeVariants(null)
                reset()
                setPreview({ thumb: '', images: [] })
            } else {
                toast.error(response.mes)
            }
        }
    }
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Customize Product Variants</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setCustomizeVariants(null)}>Back</span>
            </div>
            <form onSubmit={handleSubmit(handleAddVariant)} className='p-4 w-full flex flex-col gap-4'>
                <div className='flex gap-4 items-center w-full'>
                    <InputForm
                        label='Original Name'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{ required: 'Name is required' }}
                        style='flex-auto'
                        placeholder='Title of variant...'

                    />

                </div>
                <div className='flex gap-4 items-center w-full'>
                    <InputForm
                        label='Variant Price'
                        register={register}
                        errors={errors}
                        id='price'
                        fullWidth
                        validate={{ required: 'Price is required' }}
                        placeholder={'Enter price...'}
                        type='number'
                        style='flex-auto'
                    />
                    <InputForm
                        label='Variant Color'
                        register={register}
                        errors={errors}
                        validate={{ required: 'Color is required' }}
                        id='color'
                        fullWidth
                        placeholder={'Enter color...'}
                        style='flex-auto'
                    />

                </div>

                <div className='flex flex-col gap-2 mt-8'>
                    <label className='font-semibold' htmlFor='thumb'>Upload thumbnail</label>
                    <input
                        type='file'
                        id='thumb'
                        {...register('thumb', { required: 'Required field' })}
                    />
                    {errors['thumb'] && <small className='text-main text-sm'>{errors['thumb']?.message}</small>}
                </div>
                {preview.thumb && <div className='my-4'>
                    <img src={preview.thumb} alt='Preview thumbnail' className='w-[200px] object-contain' />
                </div>}

                <div className='flex flex-col gap-2 mt-8'>
                    <label className='font-semibold' htmlFor='products'>Upload images of product</label>
                    <input type='file'
                        id='products'
                        multiple
                        {...register('images', { required: 'Required field' })}
                    />
                    {errors['images'] && <small className='text-main text-sm'>{errors['images']?.message}</small>}
                    {preview.images.length > 0 &&
                        <div className='my-4 flex w-full gap-3 flex-wrap'>
                            {preview.images.map((el, index) => (
                                <div
                                    key={index}
                                    className='w-fit relative'
                                >
                                    <img src={el} alt='product images'
                                        className='w-[200px] object-contain' />
                                </div>
                            ))}
                        </div>}
                </div>
                <div className='my-6'>
                    <Button type='submit'>Add Variant</Button>
                </div>



            </form>
        </div>
    )
}

export default memo(CustomizeVariants)





