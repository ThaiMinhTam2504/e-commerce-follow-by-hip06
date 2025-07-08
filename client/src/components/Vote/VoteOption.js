import React, { memo, useRef, useEffect, useState } from 'react'
import logo from 'assets/logo.png'
import { voteOptions } from 'utils/contants'
import { AiFillStar } from 'react-icons/ai'
import { Button } from 'components'

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modalRef = useRef()
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('')
    const [score, setScore] = useState(null)
    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [])
    return (
        <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px]  p-4 flex flex-col gap-4 items-center justify-center'>
            <img src={logo} alt='logo' className='w-[300px] my-8 object-contain' />
            <h2 className='text-center text-lg'>{`Voting product ${nameProduct}`}</h2>
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='Write your review here...'
                className='form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm'></textarea>
            <div className='w-full flex flex-col gap-4'>
                <p>How do you like this product?</p>
                <div className='flex items-center justify-center gap-4'>
                    {voteOptions.map(el => (
                        <div key={el.id}
                            className=' w-[100px] p-4 rounded-md bg-gray-200  cursor-pointer flex items-center justify-center flex-col gap-2'
                            onClick={() => {
                                setChosenScore(el.id)
                                setScore(el.id)
                            }}
                        >
                            {Number((chosenScore) && chosenScore >= el.id) ? <AiFillStar color='orange' /> : <AiFillStar color='gray' />}
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button handleOnClick={() => handleSubmitVoteOption({ comment: comment, score: score })} fw>Submit</Button>
        </div>
    )
}

export default memo(VoteOption)