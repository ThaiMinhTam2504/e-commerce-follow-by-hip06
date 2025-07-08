import React, { memo, useState, useCallback } from 'react'
import { productInfoTabs } from '../../utils/contants'
import { Votebar, Button, VoteOption, Comment } from '..'
import { renderStarFromNumber } from '../../utils/helper'
import { apiRatings } from '../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { showModel } from '../../store/app/appSlice'
import Swal from 'sweetalert2'
import path from '../../utils/path'
import { useNavigate } from 'react-router-dom'



const ProductInfomation = ({ totalRatings, ratings, nameProduct, pid, rerender }) => {
    const [activedTab, setActivedTab] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn } = useSelector(state => state.user)

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !pid || !score) {
            alert('Please fill all fields')
            return
        }
        await apiRatings({ star: score, comment: comment, pid, updatedAt: Date.now() })
        dispatch(showModel({ isShowModal: false, modalChildren: null }))
        rerender()
    }
    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'You need to login to vote',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go to login',
                title: 'Oops!',
                showCancelButton: true,

            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate(`/${path.LOGIN}`)
                }
            })
        } else {
            dispatch(showModel({
                isShowModal: true, modalChildren: <VoteOption
                    nameProduct={nameProduct}
                    handleSubmitVoteOption={handleSubmitVoteOption}
                />
            }))
        }
    }

    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs.map(el => (
                    <span className={`p-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}

            </div>

            <div className='w-full border p-4'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            </div>

            <div className='flex flex-col py-8 w-main'>

                <div className='flex border'>
                    <div className='flex-4 flex-col  flex items-center justify-center '>
                        <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                        <span className='text-sm'>{`${ratings?.length} reviewers and commentors`}</span>
                    </div>
                    <div className='flex-6   p-4 flex flex-col gap-2 '>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el + 1}
                                ratingTotal={ratings?.length}
                                ratingCount={ratings?.filter(i => i.star === el + 1)?.length} //duyệt mảng ratings trong database xem coi có cái phần tử i nào mà i.star === el + 1 không. i ở đây đại diện cho object trong mảng ratings. el+1 là số sao mà mình đang duyệt. Nếu có thì trả về độ dài của mảng ratings đó. Tức là số lượng người vote cho cái sao đó. thao tác này là so sánh 2 mảng với nhau 1 mảng là ratings trong database và 1 mảng là ratings mà mình đã tạo ra ở trên(mảng sao). Nếu có thì trả về độ dài của mảng ratings đó. Tức là số lượng người vote cho cái sao đó.
                            // Nếu không có thì trả về 0. Tức là không có người vote cho cái sao đó
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
                    <span>Do you want to review this product ?</span>
                    <Button
                        handleOnClick={handleVoteNow} >
                        Vote now
                    </Button>
                </div>
                <div className='flex flex-col gap-4'>
                    {ratings?.map(el => (
                        <Comment
                            key={el._id}
                            star={el.star}
                            updatedAt={el.updatedAt}
                            comment={el.comment}
                            name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default memo(ProductInfomation)