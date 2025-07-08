import React, { memo } from 'react'

const Banner = () => {
    return (
        <div className='w-full'>
            <img src='https://cdn.vectorstock.com/i/1000v/09/80/online-shopping-banner-vector-17230980.jpg' alt='banner'
                className='h-[400px] w-full object-cover'
            />
        </div>
    )
}

export default memo(Banner)