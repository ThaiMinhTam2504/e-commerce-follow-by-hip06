import { useMemo } from 'react'
import { generateRange } from '../utils/helper'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    //useMemo is used to memoize the pagination array to avoid unnecessary calculations on every render
    //useMeno lưu kết quả tính toán của hàm và chỉ tính toán lại khi các giá trị phụ thuộc thay đổi, giúp tối ưu hóa hiệu suất của ứng dụng
    //khác với useCallback là hàm sẽ được gọi lại mỗi khi component render lại
    const paginationArray = useMemo(() => {
        const pageSize = process.env.REACT_APP_LIMIT || 10
        const paginationCount = Math.ceil(totalProductCount / pageSize)
        const totalPaginationItem = siblingCount + 5
        if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

        const isShowLeft = currentPage - siblingCount > 2
        const isShowRight = currentPage + siblingCount < paginationCount - 1

        if (isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 4
            const rightRange = generateRange(rightStart, paginationCount)
            return [1, <BiDotsHorizontalRounded />, ...rightRange]
        }
        if (!isShowLeft && isShowRight) {
            const leftEnd = 5
            const leftRange = generateRange(1, leftEnd)
            return [...leftRange, <BiDotsHorizontalRounded />, paginationCount]
        }
        const siblingLeft = Math.max(currentPage - siblingCount, 1)
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount)
        if (isShowLeft && isShowRight) {
            const middleRange = generateRange(siblingLeft, siblingRight)
            return [1, <BiDotsHorizontalRounded />, ...middleRange, <BiDotsHorizontalRounded />, paginationCount]
        }


    }, [totalProductCount, currentPage, siblingCount])



    return paginationArray
}
export default usePagination
// first + last + current + siblings + 2*dots
//min = 6 => siblings + 5
//totalPagination: 66,limitProduct= 10 => 7 pages (66/10) =6.6
//totalPaginationItems = siblings + 5 = 6
//siblings = 1

//[1,2,3,4,5,6]
//[1,....,5,6,7,8,9,10]
//[1,2,3,4,5,....,10]
//[1,....5,6,7....,10]

