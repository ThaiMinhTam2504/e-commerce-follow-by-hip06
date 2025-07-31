import React, { useEffect, useState, useCallback } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis/product'
import { Breadcrumb, Button, SelectQuantity, ProductExtraInfoItem, ProductInfomation, CustomSlider, SearchItem } from '../../components'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'
import { formatPrice, formatMoney, renderStarFromNumber } from '../../utils/helper'
import { productExtraInfomation } from '../../utils/contants'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { apiUpdateCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncAction'
import withBaseComponent from 'hocs/withBaseComponent'
import path from 'utils/path'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
}

const DetailProduct = ({ isQuickView, data, location, navigate, dispatch }) => {
    const params = useParams()
    const { current } = useSelector(state => state.user)
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [update, setUpdate] = useState(false)
    const [variant, setVariant] = useState(null)
    const [pid, setPid] = useState(null)
    const [category, setCategory] = useState(null)
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: '',
        price: '',
        color: '',
    })

    useEffect(() => {
        if (data) {
            setPid(data.pid)
            setCategory(data.category)
        }
        else if (params && params.pid) {
            setPid(params.pid)
            setCategory(params.category)
        }
    }, [data, params])

    useEffect(() => {
        if (variant) {
            setCurrentProduct({
                title: product?.variants?.find(el => el.sku === variant)?.title,
                color: product?.variants?.find(el => el.sku === variant)?.color,
                price: product?.variants?.find(el => el.sku === variant)?.price,
                images: product?.variants?.find(el => el.sku === variant)?.images,
                thumb: product?.variants?.find(el => el.sku === variant)?.thumb,
            })
        } else if (product) {
            setCurrentProduct({
                title: product?.title,
                color: product?.color,
                price: product?.price,
                images: product?.images || [],
                thumb: product?.thumb,
            })
        }
    }, [variant, product])

    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        if (response.success) { setRelatedProducts(response.products) }
    }

    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
            setCurrentImage(response.productData?.thumb)
        }
    }
    //Ham effect khong su dung bat dong bo duoc
    useEffect(() => {
        if (pid) {
            fetchProductData()
            fetchProducts()
        }
        window.scrollTo(0, 0)
    }, [pid])
    useEffect(() => {
        if (pid) fetchProductData()
    }, [update])
    const rerender = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setQuantity(number)
        }
    }, [quantity])

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])

    const handleClickImage = (e, el) => {
        e.stopPropagation()
        setCurrentImage(el)
    }
    // const handleClickImageWithoutEvent = (el) => {
    //     setCurrentImage(el) // Cập nhật ảnh đang xem
    // }

    const handleAddToCart = async () => {
        if (!current) return Swal.fire({
            title: 'Please login to add to cart',
            text: 'You need to login to add products to your cart.',
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
        const response = await apiUpdateCart({
            pid: pid,
            color: currentProduct?.color || product?.color,
            quantity,
            price: currentProduct?.price || product?.price,
            thumbnail: currentProduct?.thumb || product?.thumb,
            title: currentProduct?.title || product?.title
        })
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <div className={clsx('w-full')}>
            {!isQuickView && <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold'>{currentProduct.title || product?.title}</h3>
                    <Breadcrumb title={currentProduct.title || product?.title} category={category} />
                </div>
            </div>}
            <div onClick={e => e.stopPropagation()} className={clsx('bg-white m-auto mt-4 flex', isQuickView ? 'max-w-[1000px] gap-16 p-8 max-h-[80vh] overflow-y-auto' : 'w-main')}>
                <div className={clsx('flex flex-col gap-4 w-2/5', isQuickView && 'w-1/2')}>
                    <div className='h-[458px] w-[458px] border flex items-center justify-center bg-white rounded-lg shadow-lg'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: currentProduct.title || 'Product Image',
                                // src: product?.thumb,
                                src: currentImage || currentProduct.thumb,
                                isFluidWidth: false,
                                width: 420,
                                height: 420,
                                style: {
                                    objectFit: 'contain',
                                    borderRadius: '10px',
                                    background: '#fff',
                                    // borderRadius: '1rem',
                                    // border: '3px solid #60a5fa',
                                    // boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.1)',
                                    // backgroundColor: 'red'
                                }
                            },
                            largeImage: {
                                // src: product?.thumb,
                                // src: currentProduct.images || currentImage,
                                // width: 2000,
                                // height: 1200
                                src: currentImage || currentProduct.thumb,
                                width: 2000,
                                height: 1200
                            },
                            enlargedImageContainerDimensions: {
                                width: "360%", // Hoặc 100%
                                height: "100%"
                                // width: '320px',
                                // height: '320px'
                            },
                            enlargedImageStyle: {
                                objectFit: 'contain',
                                borderRadius: '8px',
                                background: '#fff'
                            },
                            lensStyle: {
                                // width: "50px",
                                // height: "50px",
                                // borderRadius: "0px"

                                background: 'rgba(0,0,0,0.1)',
                                border: '2px solid #3182ce',
                                width: '140px',
                                height: '140px',
                                borderRadius: '8px'
                            },
                            isHintEnabled: true,
                            shouldUsePositiveSpaceLens: true,

                        }} />
                    </div>
                    {/* <img src={product?.images} alt="product" className='h-[458px] w-[458px] object-cover border' /> */}

                    <div className='w-[458px]'>
                        <Slider className='image-silder flex gap-2 justify-between'  {...settings}>
                            {/* {currentProduct.images.length == 0 && product?.images.map(el => (
                                <div key={el} className='flex-1'>
                                    <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-cover cursor-pointer' />
                                </div>
                            ))}
                            {currentProduct.images.length > 0 && currentProduct?.images?.map(el => (
                                <div key={el} className='flex-1'>
                                    <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-cover cursor-pointer' />
                                </div>
                            ))} */}

                            {(currentProduct.images && currentProduct.images.length > 0
                                ? currentProduct.images
                                : product?.images || []
                            ).map(el => (
                                <div key={el} className='flex-1'>
                                    <img
                                        onClick={e => handleClickImage(e, el)}
                                        // onClick={() => handleClickImageWithoutEvent(el)}
                                        src={el}
                                        alt='sub-product'
                                        className={clsx(
                                            'h-[143px] w-[143px] border object-cover cursor-pointer rounded-lg shadow-md transition-all duration-200 hover:border-blue-400 hover:scale-105',
                                            currentImage === el && 'border-2 border-blue-500 ring-2 ring-blue-300 sclae-105'
                                        )}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className={clsx('w-2/5 pr-[24px] flex flex-col gap-4', isQuickView && 'w-1/2')}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(currentProduct?.price || product?.price))}`}</h2>
                        <span className='text-sm text-main font-semibold'>{`STOCK: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                        <span className='text-sm text-main underline font-medium italic'>{`SOLD: ${product?.sold}`}</span>
                    </div>
                    <ul className='list-square text-sm text-gray-500 pl-4'>
                        {product?.description?.length > 1 && product?.description?.map(el => (
                            <li className='leading-6' key={el}>{el}</li>
                        ))}
                        {product?.description?.length === 1 && <div className='text-sm line-clamp-[10] mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }} ></div>}
                    </ul>
                    <div className='my-4 flex gap-4'>
                        <span className='font-bold'>Color</span>
                        <div className='flex flex-wrap gap-4 items-center w-full'>
                            <div
                                onClick={() => {
                                    setVariant(null)
                                    setCurrentImage(product?.thumb)
                                }}
                                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !variant && 'border-red-500')}>
                                <img src={product?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                                <span className='flex flex-col'>
                                    <span>{product?.color}</span>
                                    <span className='text-sm'>{product?.price}</span>
                                </span>
                            </div>
                            {product?.variants?.map(el => (
                                <div
                                    key={el.sku}
                                    onClick={() => {
                                        setVariant(el.sku)
                                        setCurrentImage(el.thumb)
                                    }}
                                    className={clsx('flex items-center gap-2 p-2 border cursor-pointer', variant === el.sku && 'border-red-500')}>
                                    <img src={el.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                                    <span className='flex flex-col'>
                                        <span>{el.color}</span>
                                        <span className='text-sm'>{el.price}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button
                            handleOnClick={handleAddToCart}
                            fw
                        >
                            Add to cart
                        </Button>
                    </div>
                </div>
                {!isQuickView && <div className=' w-1/5'>
                    {productExtraInfomation.map(el => (
                        <ProductExtraInfoItem
                            key={el.id}
                            title={el.title}
                            icon={el.icon}
                            sub={el.sub}
                        />
                    ))}
                </div>}
            </div>
            {!isQuickView && <div className='w-main m-auto mt-8'>
                <ProductInfomation
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={rerender}
                />
            </div>}
            {!isQuickView && <>
                <div className='w-main m-auto mt-8'>
                    <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKE</h3>
                    <CustomSlider normal={true} products={relatedProducts} />
                </div>
                <div className='h-[100px] w-full'></div>
            </>}
        </div>
    )
}

export default withBaseComponent(DetailProduct)