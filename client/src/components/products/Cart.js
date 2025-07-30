import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { showCart } from 'store/app/appSlice'
import { formatMoney } from 'utils/helper'

const Cart = ({ dispatch }) => {
    const { current } = useSelector(state => state.user)
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen overflow-hidden bg-black text-white p-6 grid grid-rows-10'>
            <header className=' border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='p-2 cursor-pointer'> <AiFillCloseCircle size={24} /></span>
            </header>
            <section className='row-span-6 h-full max-h-full overflow-y-auto py-3 flex flex-col gap-3'>
                {!current?.cart && <div className='text-center text-gray-400'>Your cart is empty</div>}
                {current?.cart && current?.cart?.map((el) => (
                    <div
                        key={el._id}
                        className='flex gap-2'>
                        <img src={el.product?.thumb} alt='thumb' className='w-16 h-16 object-cover' />
                        <div className='flex flex-col gap-1'>
                            <span className='text-sm text-main'>{el.product?.title}</span>
                            <span className='text-[10px]'>{el.color}</span>
                            <span className='text-sm'>{formatMoney(el.product?.price)}</span>
                        </div>
                    </div>))}
            </section>
            <div className='row-span-3 h-full '>
                checkout
            </div>

        </div>
    )
}

export default withBaseComponent(memo(Cart))