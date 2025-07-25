import { MarkdownEditor, Select, Button, Loader } from 'components'
import InputForm from 'components/inputs/inputForm'
import React, { memo, useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { validate, getBase64 } from 'utils/helper'
import { apiUpdateProduct } from 'apis'
import { showModel } from 'store/app/appSlice'
import { useDispatch, useSelector } from 'react-redux'


const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand?.toLowerCase() || ','
        })
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(',') : editProduct?.description })
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || []
        })
    }, [editProduct])

    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handlePreviewThumb = async (file) => {
        if (!file) return
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }


    const handlePreviewImages = async (files) => {
        // if (!files || typeof files !== 'object' || !files.length) return;

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
        // setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
            handlePreviewThumb(watch('thumb')[0]) //cách anh hịp
        //cách mới
        // const thumb = watch('thumb')
        // if (thumb instanceof FileList && thumb.length > 0)
        //     handlePreviewThumb(thumb[0])
    }, [watch('thumb')])
    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'))
    }, [watch('images')])



    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title

            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            // for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]) //cach anh hịp

            for (let [key, value] of Object.entries(finalPayload)) {
                //khong append thumb va images o day, xu ly rieng bien duoi
                if (key !== 'thumb' && key !== 'images') {
                    formData.append(key, value)
                }
            }

            //thumb
            // if (finalPayload.thumb && finalPayload.thumb.length > 0) formData.append('thumb', finalPayload?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0]) // cach anh hịp
            if (finalPayload.thumb && finalPayload.thumb instanceof FileList && finalPayload.thumb.length > 0) {
                // Nếu chọn ảnh mới
                formData.append('thumb', finalPayload.thumb[0])
            } else if (preview.thumb && typeof preview.thumb === 'string') {
                // Nếu không chọn ảnh mới, gửi lại link ảnh cũ
                formData.append('thumb', preview.thumb)
            }

            //images
            // if (finalPayload.images) {
            //     const images = finalPayload?.images?.length === 0 ? preview.images : finalPayload.images
            //     for (let image of images) formData.append('images', image)
            // } //cach anh hịp
            if (finalPayload.images && finalPayload.images instanceof FileList && finalPayload.images.length > 0) {
                // Nếu chọn ảnh mới
                for (let file of finalPayload.images) {
                    formData.append('images', file)
                }
            } else if (preview.images && Array.isArray(preview.images) && preview.images.length > 0) {
                // Nếu không chọn ảnh mới, gửi lại link ảnh cũ
                for (let img of preview.images) {
                    formData.append('images', img)
                }
            }


            dispatch(showModel({ isShowModal: true, modalChildren: <Loader /> }))
            const response = await apiUpdateProduct(formData, editProduct?._id)
            dispatch(showModel({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditProduct(null)
            } else toast.error(response.mes)
        }
    }

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4 border-b  flex justify-between items-center fixed right-0 left-[327px] top-0 bg-gray-100'>
                <h1 className='text-3xl font-bold tracking-tight '>Update Products</h1>
                <span onClick={() => setEditProduct(null)} className='text-main hover:underline cursor-pointer'>Close</span>
            </div>
            <form onSubmit={handleSubmit(handleUpdateProduct)}>
                <InputForm
                    label='Product Name'
                    register={register}
                    errors={errors}
                    id='title'
                    validate={{ required: 'Required field' }}
                    fullWidth
                    placeholder='Enter product name'
                />
                <div className='w-full my-6 flex gap-4'>
                    <InputForm
                        label='Price'
                        register={register}
                        errors={errors}
                        id='price'
                        validate={{ required: 'Required field' }}
                        style='flex-auto'
                        placeholder='Enter product price'
                        type='number'

                    />
                    <InputForm
                        label='Quantity'
                        register={register}
                        errors={errors}
                        id='quantity'
                        validate={{ required: 'Required field' }}
                        style='flex-auto'
                        placeholder='Enter product quantity'
                        type='number'

                    />
                    <InputForm
                        label='Color'
                        register={register}
                        errors={errors}
                        id='color'
                        validate={{ required: 'Required field' }}
                        style='flex-auto'
                        placeholder='Enter product color'
                    />
                </div>
                <div className=' w-full  my-6 flex gap-4'>
                    <Select
                        label='Category'
                        options={categories?.map(el => ({
                            code: el.title,
                            value: el.title
                        }))}
                        register={register}
                        errors={errors}
                        id='category'
                        validate={{ required: 'Required field' }}
                        style='flex-auto'
                        fullWidth={true}
                    />
                    <Select
                        label='Brand (optional)'
                        options={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({
                            code: el.toLowerCase(),
                            value: el
                        }))}
                        register={register}
                        errors={errors}
                        id='brand'

                        style='flex-auto'
                        fullWidth={true}
                    />
                </div>
                <MarkdownEditor
                    name='description'
                    changeValue={changeValue}
                    label='Description'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    value={payload.description}
                />
                <div className='flex flex-col gap-2 mt-8 ml-6'>
                    <label
                        className='font-semibold text-blue-600 mb-1 uppercase tracking-wide'
                    >
                        Upload thumbnail
                    </label>
                    <label
                        htmlFor='thumb'
                        className='cursor-pointer px-4 py-2 bg-blue-500 text-white rounded w-fit font-medium shadow transition duration-200 hover:bg-blue-300 hover:scale-105'
                    >
                        Choose a thumbnail
                    </label>
                    <input
                        type='file'
                        id='thumb'
                        {...register('thumb')}
                        className='hidden'
                    />
                    {errors['thumb'] && <small className='text-main text-sm'>{errors['thumb']?.message}</small>}
                </div>
                {preview.thumb &&
                    <div className='my-4 ml-6'>
                        <div className='border-2 border-gray-400 rounded-lg p-2 bg-white w-[120px] h-[120px] flex items-center justify-center'>
                            <img
                                src={preview.thumb}
                                alt='Preview thumbnail'
                                className='w-[100px] h-[100px] object-cover rounded' />
                        </div>
                    </div>}

                <div className='flex flex-col gap-2 mt-8 ml-6'>
                    <label
                        className='font-semibold text-blue-600 mb-1 uppercase tracking-wide relative'
                    >
                        Upload images of product <small className='text-gray-500 absolute top-1 left-[240px] text-xs ml-1'>(Hold Ctrl to select multiple images)</small>
                    </label>
                    <label
                        htmlFor='products'
                        className='cursor-pointer px-4 py-2 bg-blue-500 text-white rounded w-fit  font-medium shadow transition duration-200 hover:bg-blue-300 hover:scale-105'
                    >
                        Choose product images
                    </label>
                    <input
                        type='file'
                        id='products'
                        multiple
                        {...register('images')}
                        className='hidden'
                    />
                    {errors['images'] && <small className='text-main text-sm'>{errors['images']?.message}</small>}
                    {preview.images.length > 0 &&
                        <div className='my-4  flex w-full gap-3 flex-wrap preview-images'>
                            {preview.images.map((el, index) => (
                                <div key={index} className='w-fit relative image-preview-item'>
                                    <img src={el} alt='product images'
                                        className='preview-img' />
                                </div>
                            ))}
                        </div>}
                </div>
                <div className='my-6'>
                    <Button type='submit'>Update product</Button>
                </div>
            </form>
        </div>
    )
}

export default memo(UpdateProduct)