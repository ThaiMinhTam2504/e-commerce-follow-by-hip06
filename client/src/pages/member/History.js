import { apiGetOrders, apiGetUserOrders } from 'apis/order'
import { CustomSelect, Pagination } from 'components'
import InputForm from 'components/inputs/inputForm'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { statusOrder } from 'utils/contants'
import withBaseComponent from 'hocs/withBaseComponent'

const History = ({ navigate, location }) => {
    const [orders, setOrders] = useState(null)
    const [counts, setCounts] = useState(0)
    const [params] = useSearchParams()
    const { register, formState: { errors }, watch, setValue } = useForm()
    const q = watch('q')
    const status = watch('status')
    const fetchOrders = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        })
        if (response.success) {
            setOrders(response.orders)
            setCounts(response.counts)
        }
    }
    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchOrders(pr)
    }, [params])


    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }


    const handleDeleteProduct = () => {

    }
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return 'text-green-600  text-xs font-medium'
            case 'pending':
                return 'text-yellow-500 text-xs font-medium'
            case 'failed':
            case 'cancelled':
                return 'text-red-500 text-xs font-medium'
            default:
                return 'text-gray-500 text-xs font-medium'
        }
    }
    return (
        <div>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                Order History
            </header>
            <div className='flex justify-end items-center px-4'>
                <form className='w-[45%] grid grid-cols-2 gap-4'>
                    <div className='col-span-1'>
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder="Search orders by status"
                        />
                    </div>
                    <div className='col-span-1 flex items-center'>
                        <CustomSelect
                            options={statusOrder}
                            value={status}
                            onChange={(val) => handleSearchStatus(val)}
                            wrapClassname={'w-full'}
                        />
                    </div>
                </form>
            </div>
            <table className='table-auto w-full text-center'>
                <thead>
                    <tr className='border bg-sky-900 text-white border-white '>
                        <th className='text-center py-2'>No.</th>
                        <th className='text-center py-2'>Products</th>
                        <th className='text-center py-2'>Total</th>
                        <th className='text-center py-2'>Status</th>
                        <th className='text-center py-2'>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((el, index) => (
                        <tr className='border-b border-gray-300 hover:bg-sky-100' key={el._id}>
                            <td className='text-center py-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + (index + 1)}</td>
                            <td className='text-center py-2 max-w-[300px]'>
                                <span className='grid grid-cols-4 gap-4'>
                                    {el.products?.map(item => (
                                        <span className='flex col-span-1 items-center gap-2' key={item._id}>
                                            <img src={item.thumbnail} alt='thumb' className='w-8 h-8 object-cover rounded-md' />
                                            <span className='flex flex-col'>
                                                <span title={item.title} className='font-semibold text-sm truncate max-w-[120px] cursor-pointer'>{item.title}</span>
                                                <span className='flex items-center text-xs gap-2'>
                                                    <span>Quantity:</span>
                                                    <span className='text-main'>{item.quantity}</span>
                                                </span>
                                            </span>
                                        </span>))}
                                </span>
                            </td>
                            <td className='text-center py-2'>{'$' + el.total}</td>
                            <td className={getStatusColor(el.status)}>{el.status}</td>
                            <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>

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

export default withBaseComponent(History)