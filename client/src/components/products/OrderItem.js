import React, { useState, useCallback, useEffect } from 'react'
import { formatMoney } from 'utils/helper'
import { SelectQuantity } from 'components'
import { updateCart } from 'store/user/userSlice'
import withBaseComponent from 'hocs/withBaseComponent'
const OrderItem = ({ el, defaultQuantity = 1, dispatch }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => prev - 1)
        if (flag === 'plus') setQuantity(prev => prev + 1)
    }, [quantity])
    useEffect(() => {
        dispatch(updateCart({ pid: el.product?._id, quantity, color: el.color }))
        // handleChangeQuantities && handleChangeQuantities(el.product?._id, quantity, el.color)
    }, [quantity])
    return (
        <div className=' w-main mx-auto border font-bold my-1 hover:bg-gray-100 transition-all duration-200 grid grid-cols-10'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2 m-3'>
                    <img src={el.thumbnail} alt='thumb' className='w-28 h-28 object-cover rounded-md' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='text-sm text-main'>{el.title}</span>
                        <span className='text-[10px]'>{el.color}</span>
                    </div>
                </div>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div className='flex items-center h-full justify-center'>
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>
            </span>
            <span className='col-span-3 w-full text-center flex items-center justify-center'>
                <span className='text-lg'>{formatMoney(el.price * quantity)}</span>
            </span>
        </div>
    )
}

export default withBaseComponent(OrderItem)