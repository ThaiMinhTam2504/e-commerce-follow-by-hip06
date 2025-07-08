import { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState('')
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            setDebounceValue(value)
        }, ms)
        return () => {
            clearTimeout(setTimeoutId)
        }
    }, [value, ms])
    return debounceValue
}

export default useDebounce

// muốn: khi mà nhập thay đổi giá thì sẽ gọi api
// Vấn đề: gọi api liên tục theo mỗi lượt nhập
//resolve: chỉ call khi người dùng nhập xong.
// thời gian onchange

//tách price thành 2 biến
//1. biến để phục UI, gõ tới đâu thì lưu tới đó =>UI render
//2. biến thứ 2 dùng để qđịnh call api =>setTimeout => biến sẽ được gán sau 1 khoảng thời gian.