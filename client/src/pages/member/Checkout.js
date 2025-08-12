import React, { useEffect, useState } from 'react'
import paymentsvg from 'assets/shopping-day.svg'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helper'
import { Congrat, Paypal } from 'components'
import InputForm from 'components/inputs/inputForm'
import { set, useForm } from 'react-hook-form'
import withBaseComponent from 'hocs/withBaseComponent'
import { getCurrent } from 'store/user/asyncAction'

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user)
    const { register, formState: { errors }, watch, setValue } = useForm()
    const [isSuccess, SetIsSuccess] = useState(false)
    useEffect(() => {
        setValue('address', current?.address || '')
    }, [current])
    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent())
        }
    }, [isSuccess])
    const address = watch('address')
    return (
        <div className='p-8 w-full gap-6  grid grid-cols-10 h-full max-h-screen overflow-y-auto'>
            {isSuccess && <Congrat />}
            <div className='w-full flex items-center justify-center col-span-4'>
                < img src={paymentsvg} alt="Payment" className='h-[70%] object-contain' />
            </div>
            <div className='w-full flex flex-col justify-center  gap-6 col-span-6'>
                <h2 className='text-3xl mb-6 font-bold'>Checkout your items</h2>
                <div className='flex w-full gap-6'>
                    <table className='table-auto flex-1'>
                        <thead>
                            <tr className='border bg-gray-200'>
                                <th className='text-left p-2'>Products</th>
                                <th className='text-center p-2'>Quantity</th>
                                <th className='text-right p-2'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCart?.map(el => (
                                <tr key={el._id} className='border'>
                                    <td className='text-left p-2'>{el.title}</td>
                                    <td className='text-center p-2'>{el.quantity}</td>
                                    <td className='text-right p-2'>{formatMoney(el.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex-1 flex flex-col justify-between gap-[45px]'>
                        <div className='flex flex-col gap-6'>
                            <span className='flex items-center gap-8 text-sm'>
                                <span className='font-medium'>Subtotal:</span>
                                <span className='text-main font-bold'>{formatMoney(currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0))}</span>
                            </span>
                            <InputForm
                                label='Your Address'
                                register={register}
                                errors={errors}
                                id='address'
                                validate={{ required: 'Address is required' }}
                                style='text-sm'
                                placeholder={'Enter your address'}
                            />
                        </div>
                        {address && address.length > 10 && <div >
                            <Paypal
                                payload={{
                                    products: currentCart, total: Math.round(+currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) / 25000),
                                    address: address
                                }}
                                SetIsSuccess={SetIsSuccess}
                                amount={Math.round(+currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) / 25000)}
                            />
                        </div>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default withBaseComponent(Checkout)