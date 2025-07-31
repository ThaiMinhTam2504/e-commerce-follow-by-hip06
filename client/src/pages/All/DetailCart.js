import { Breadcrumb, Button, SelectQuantity } from 'components'
import OrderItem from 'components/products/OrderItem'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCart } from 'store/user/userSlice'
import { formatMoney } from 'utils/helper'

const DetailCart = ({ dispatch, location }) => {
    const { currentCart } = useSelector(state => state.user)

    // const handleChangeQuantities = (pid, quantity, color) => {
    //     //console.log({pid,quantity, color})
    //     //console.log(currentCart)
    //     dispatch(updateCart({ pid, quantity, color }))
    // }

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold  uppercase'>My Cart</h3>
                    <Breadcrumb category={location?.pathname?.replace('/', '')?.split('-')?.join(` `)} />
                </div>
            </div>
            <div className='flex flex-col border my-8 w-main mx-auto'>
                <div className=' w-main mx-auto font-bold py-3 grid grid-cols-10 bg-main opacity-80 text-white'>
                    <span className='col-span-6 w-full pl-[100px]'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Total</span>
                </div>
                {currentCart?.map(el => (
                    <OrderItem key={el._id}
                        // handleChangeQuantities={handleChangeQuantities}
                        el={el}
                        defaultQuantity={el.quantity}
                    />
                ))}
            </div>
            <div className='w-main mx-auto flex flex-col justify-center items-end gap-3 mb-12'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal:</span>
                    <span className='text-main font-bold'>{formatMoney(currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0))}</span>
                </span>
                <span className='text-gray-500 text-xs italic'>Shipping, taxes, and discounts calculated at checkout</span>
                <Button>Checkout</Button>
            </div>
        </div>
    )
}

export default withBaseComponent(DetailCart)