import Button from 'components/buttons/Button'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { showCart } from 'store/app/appSlice'
import { formatMoney } from 'utils/helper'
import { ImBin } from 'react-icons/im'
import { apiRemoveProductFromCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncAction'
import path from 'utils/path'

const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user)
    const removeCartItem = async (pid, color) => {
        const removeCartItem = await apiRemoveProductFromCart(pid, color)
        if (removeCartItem.success) {
            dispatch(getCurrent())
        } else {
            toast.error(removeCartItem.mes)
        }
    }
    // console.log(current)
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen overflow-hidden bg-black text-white p-6 grid grid-rows-10'>
            <header className=' border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='p-2 cursor-pointer'> <AiFillCloseCircle size={24} /></span>
            </header>
            <section className='row-span-7 h-full max-h-full overflow-y-auto py-3 flex flex-col gap-3'>
                {!currentCart && <div className='text-center text-gray-400'>Your cart is empty</div>}
                {currentCart?.map((el) => (
                    <div
                        key={el._id}
                        className='flex gap-2 justify-between items-center bg-gray-800 p-3 rounded-md hover:bg-gray-700 transition-all duration-200'>
                        <img src={el.thumbnail} alt='thumb' className='w-16 h-16 object-cover' />
                        <div className='flex flex-col gap-1'>
                            <span className='text-sm text-main'>{el.title}</span>
                            <span className='text-[10px]'>{el.color}</span>
                            <span className='text-sm'>{formatMoney(el.price)} * {el.quantity} = {formatMoney(el.price * el.quantity)}</span>
                        </div>
                        <span onClick={() => removeCartItem(el.product?._id, el.color)} className='h-8 w-8 rounded-full hover:bg-red-700 cursor-pointer flex justify-center items-center'><ImBin size={16} /></span>
                    </div>))}
            </section>
            <div className='row-span-2 flex flex-col justify-between h-full '>
                <div className='flex items-center  justify-between pt-4 border-t  border-gray-500'>
                    <span>Subtotal:</span>
                    <span>{formatMoney(currentCart?.reduce((sum, el) => sum + Number(el.price) * el.quantity, 0))}</span>
                </div>
                <span className='text-center text-gray-400 italic text-xs'>Shipping,taxes, and discounts calculated at checkout</span>
                <Button
                    handleOnClick={() => {
                        dispatch(showCart())
                        navigate(`/${path.DETAIL_CART}`)
                    }}
                    style={'rounded-none w-full bg-main p-3 mt-3'}>
                    Edit Cart
                </Button>
            </div>

        </div>
    )
}

export default withBaseComponent(memo(Cart))