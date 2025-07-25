import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination, CustomizeVariants } from 'components'
import { set, useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from 'apis/product'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import Swal from 'sweetalert2'
import icons from 'utils/icons'


const ManageProducts = () => {
    const { RiDeleteBin6Line, BiCustomize, BiEdit } = icons
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editProduct, setEditProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [customzieVariants, setCustomizeVariants] = useState(null)

    const render = useCallback(() => {
        setUpdate(!update)
    }, [])

    const { register, formState: { errors }, watch } = useForm()

    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) {
            setCounts(response.counts)
            setProducts(response.products)
        }
    }
    const queryDebounce = useDebounce(watch('q'), 800)
    useEffect(() => {
        if (queryDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString()
            })
        } else {
            navigate({
                pathname: location.pathname,
            })
        }
    }, [queryDebounce])
    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchProducts(searchParams)
    }, [params, update])

    const handleDeleteProduct = async (pid) => {
        Swal.fire('Are you sure?', 'You won\'t be able to revert this!', 'warning', {
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(pid)
                if (response.success) {
                    Swal.fire('Deleted!', response.mes, 'success')
                    fetchProducts()
                } else {
                    Swal.fire('Error!', response.mes, 'error')
                }
                render()
            }
        })
    }



    //relative diem tua la chinh no
    //absolute diem la the cha gan nhat voi no co xet the postion (bat ke no la relative hay absolute)
    //fixed diem tua la man hinh cua minh

    //diem tua
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            {editProduct &&
                <div className='absolute inset-0 min-h-screen z-50 bg-white'>
                    <UpdateProduct
                        setEditProduct={setEditProduct}
                        editProduct={editProduct}
                        render={render} />
                </div>}
            {customzieVariants &&
                <div className='absolute inset-0 min-h-screen z-50 bg-white'>
                    <CustomizeVariants
                        customzieVariants={customzieVariants}
                        setCustomizeVariants={setCustomizeVariants}
                        render={render} />
                </div>}
            <div className='h-[69px] w-full'></div>
            <div className='p-4 border-b w-full flex justify-between items-center fixed top-0 bg-gray-100'>
                <h1 className='text-3xl font-bold tracking-tight '>Manage Products</h1>
            </div>
            <div className='flex justify-end items-center px-4'>
                <form className='w-[45%]' >
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        fullWidth={true}
                        placeholder='Search products...'
                    />
                </form>
            </div>
            <table className='table-auto'>
                <thead>
                    <tr className='border bg-sky-900 text-white border-white '>
                        <th className='text-center py-2'>Order</th>
                        <th className='text-center py-2'>Thumb</th>
                        <th className='text-center py-2'>Title</th>
                        <th className='text-center py-2'>Brand</th>
                        <th className='text-center py-2'>Category</th>
                        <th className='text-center py-2'>Price</th>
                        <th className='text-center py-2'>Quantity</th>
                        <th className='text-center py-2'>Sold</th>
                        <th className='text-center py-2'>Color</th>
                        <th className='text-center py-2'>Total Ratings</th>
                        <th className='text-center py-2'>Variants</th>
                        <th className='text-center py-2'>Updated At</th>
                        <th className='text-center py-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((el, index) => (
                        <tr className='border-b' key={el._id}>
                            <td className='text-center py-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + (index + 1)}</td>
                            <td className='text-center py-2'>
                                <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover' />
                            </td>
                            <td className='text-center py-2'>{el.title}</td>
                            <td className='text-center py-2'>{el.brand}</td>
                            <td className='text-center py-2'>{el.category}</td>
                            <td className='text-center py-2'>{el.price}</td>
                            <td className='text-center py-2'>{el.quantity}</td>
                            <td className='text-center py-2'>{el.sold}</td>
                            <td className='text-center py-2'>{el.color}</td>
                            <td className='text-center py-2'>{el.totalRatings}</td>
                            <td className='text-center py-2'>{el.variants?.length || 0}</td>
                            <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                            <td className='text-center py-2'>
                                <span
                                    onClick={() => setEditProduct(el)}
                                    className='text-blue-500  cursor-pointer px-1 inline-block hover:text-orange-500'>
                                    <BiEdit size={20} /></span>
                                <span
                                    onClick={() => handleDeleteProduct(el._id)}
                                    className='text-red-500  cursor-pointer px-1 inline-block hover:text-orange-800'>
                                    <RiDeleteBin6Line size={20} /></span>
                                <span
                                    onClick={() => setCustomizeVariants(el)}
                                    className='text-green-400  cursor-pointer px-1 inline-block hover:text-orange-500'>
                                    <BiCustomize size={20} /></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='w-full flex justify-end my-8'>
                <Pagination totalCount={counts} />
            </div>
        </div>
    )


}

export default ManageProducts