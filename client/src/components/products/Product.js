import React, { useState, memo } from 'react'
import { formatMoney } from 'utils/helper'
import trending from 'assets/trending.png'
import label from 'assets/new.png'
import { renderStarFromNumber } from 'utils/helper'
import { SelectOption } from '..'
import icons from 'utils/icons'
import withBaseComponent from 'hocs/withBaseComponent'
import { showModel } from 'store/app/appSlice'
import { DetailProduct } from 'pages/All'
import { apiUpdateCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncAction'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'utils/path'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { createSearchParams } from 'react-router-dom'

const { AiFillEye, BsFillSuitHeartFill, FaCartPlus } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch, location }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    const { current } = useSelector(state => state.user)
    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        e.preventDefault()
        if (flag === 'CART') {
            if (!current) return Swal.fire({
                title: 'Please login to add to cart',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) navigate({
                    pathname: `/${path.LOGIN}`,
                    search: createSearchParams({ redirect: location.pathname }).toString()
                })
            })
            const response = await apiUpdateCart({ pid: productData?._id, color: productData?.color })
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            } else {
                toast.error(response.mes)
                dispatch(getCurrent())
            }
        }
        if (flag === 'WISHLIST') {
            // Handle wishlist logic here
            console.log('Add to wishlist', productData._id)
        }
        if (flag === 'QUICK_VIEW') {
            dispatch(showModel({
                isShowModal: true,
                modalChildren: <DetailProduct data={{ pid: productData?._id, category: productData?.category }} isQuickView={true} />
            }))
        }
    }
    return (
        <div className='w-full text-base px-[10px]'>
            <div
                onClick={() => navigate(`/${productData.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
                className='w-full border p-[15px] flex flex-col items-center'
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className='w-full relative'>
                    {isShowOption && <div
                        className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'
                    >
                        <span title='Quick View' onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}> <SelectOption icon={<AiFillEye />} /></span>
                        {current?.cart?.some(el => el.product === productData._id)
                            ? <span title='ADDED' ><SelectOption icon={<BsFillCartCheckFill color='gray' />} /></span>
                            : <span title='Add to Cart' onClick={(e) => handleClickOptions(e, 'CART')}><SelectOption icon={<FaCartPlus />} /></span>
                        }
                        <span title='Add to Wishlist' onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icon={<BsFillSuitHeartFill />} /></span>
                    </div>}
                    <img
                        src={productData?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                        alt=""
                        className='w-[274px] h-[274px] object-cover'
                    />
                    {!normal && <img src={isNew ? label : trending} alt="" className={'absolute w-[100px] h-[30px] top-0 right-0 object-cover'} />}
                </div>
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full '>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} `}</span>
                </div>
            </ div>
        </div >
    )
}

export default withBaseComponent(memo(Product))