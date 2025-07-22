import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Select, Button, MarkdownEditor, Loader } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { validate, getBase64 } from 'utils/helper'
import { toast } from 'react-toastify'
import { apiCreateProduct } from 'apis'
import { showModel } from 'store/app/appSlice'


const CreateProducts = () => {
    const { categories } = useSelector(state => state.app)
    const dispatch = useDispatch()
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()

    const [payload, setPayload] = useState({
        description: '',
    })
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [invalidFields, setInvalidFields] = React.useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const [hoverElm, SetHoverElm] = useState(null)

    const handlePreviewThumb = async (file) => {
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
            imagesPreview.push({ name: file.name, path: base64 })
        }
        if (imagesPreview.length > 0) setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])
    useEffect(() => {
        handlePreviewImages(watch('images'))
    }, [watch('images')])



    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
            const finalPayload = { ...data, ...payload }
            console.log({ ...data, ...payload })
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append('images', image)
            }
            dispatch(showModel({ isShowModal: true, modalChildren: <Loader /> }))
            const response = await apiCreateProduct(formData)
            dispatch(showModel({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                reset()
                setPayload({
                    thumb: '',
                    images: [],
                })
            } else toast.error(response.mes)


            // for (var pair of formData.entries()) {
            //     console.log(pair[0] + ',' + pair[1])
            // }

        }
    }
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex  justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Create Products</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                                code: el._id,
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
                            options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({
                                code: el,
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
                        value=''
                        changeValue={changeValue}
                        label='Description'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
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
                                        onMouseEnter={() => SetHoverElm(el.name)}
                                        onMouseLeave={() => SetHoverElm(null)}
                                        key={index} className='w-fit relative'>
                                        <img src={el.path} alt='product images'
                                            className='w-[200px] object-contain' />
                                        {/*{hoverElm === el.name && <div
                                            onClick={() => handleRemoveImage(el.name)}
                                            className='absolute animate-scale-up-center inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer'>
                                            <IoTrashBinSharp size={24} color='white' />
                                        </div>
                                        }*/}
                                    </div>
                                ))}
                            </div>}
                    </div>
                    <div className='my-6'>
                        <Button type='submit'>Create new product</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProducts