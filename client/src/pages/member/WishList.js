import { Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'

const WishList = () => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full relative px-4'>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                My WishList
            </header>
            <div className='p-4 w-full flex flex-wrap gap-4'>
                {current?.whistlist?.map(el => (
                    <div className='bg-white rounded-md min-w-[300px] drop-shadow py-3 flex flex-col gap-3' key={el._id}>
                        <Product
                            pid={el._id}
                            productData={el}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WishList