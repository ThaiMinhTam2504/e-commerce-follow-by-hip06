import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'


const Congrat = () => {
    const { width, height } = useWindowSize()
    return (
        <Confetti
            width={width}
            height={height}
            numberOfPieces={200}
            recycle={false}
            gravity={0.05}
            tweenDuration={1000}
            className='absolute top-0 left-0 z-10'
        />
    )
}

export default Congrat