import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis/product'
import { Breadcrumb, Button, SelectQuantity, ProductExtraInfoItem, ProductInfomation, CustomSlider } from '../../components'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'
import { formatPrice, formatMoney, renderStarFromNumber } from '../../utils/helper'
import { productExtraInfomation } from '../../utils/contants'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
}

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [update, setUpdate] = useState(false)

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
    return (
        <div className='w-full '>
            <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold'>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
            <div className='w-main m-auto mt-4 flex'>
                <div className=' flex flex-col gap-4 w-2/5'>
                    <div className='h-[458px] w-[458px] border'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                // src: product?.thumb,
                                src: currentImage,
                            },
                            largeImage: {
                                // src: product?.thumb,
                                src: currentImage,
                                width: 2000,
                                height: 1200
                            },
                            enlargedImageContainerDimensions: {
                                width: "260%", // Hoặc 100%
                                height: "100%"
                            },
                            lensStyle: {
                                width: "50px",
                                height: "50px",
                                borderRadius: "0px"
                            }
                        }} />
                    </div>
                    {/* <img src={product?.images} alt="product" className='h-[458px] w-[458px] object-cover border' /> */}
                    <div className='w-[458px]'>
                        <Slider className='image-silder flex gap-2 justify-between'  {...settings}>
                            {product?.images.map(el => (
                                <div key={el} className='flex-1'>
                                    <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-cover cursor-pointer' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='w-2/5 pr-[24px] flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))}`}</h2>
                        <span className='text-sm text-main font-semibold'>{`STOCK: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                        <span className='text-sm text-main underline font-medium italic'>{`SOLD: ${product?.sold}`}</span>
                    </div>
                    <ul className='list-square text-sm text-gray-500 pl-4'>
                        {product?.description?.map(el => (
                            <li className='leading-6' key={el}>{el}</li>
                        ))}
                    </ul>
                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button fw>
                            Add to cart
                        </Button>
                    </div>
                </div>
                <div className=' w-1/5'>
                    {productExtraInfomation.map(el => (
                        <ProductExtraInfoItem
                            key={el.id}
                            title={el.title}
                            icon={el.icon}
                            sub={el.sub}
                        />
                    ))}
                </div>
            </div>
            <div className='w-main m-auto mt-8'>
                <ProductInfomation
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={rerender}
                />
            </div>
            <div className='w-main m-auto mt-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKE</h3>
                <CustomSlider normal={true} products={relatedProducts} />
            </div>
            <div className='h-[100px] w-full'></div>
        </div>
    )
}

export default DetailProduct