import React, { memo } from 'react'
import Slider from 'react-slick'
import { Product } from '..'
import withBaseComponent from 'hocs/withBaseComponent';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const CustomSlider = ({ products, activeTab, normal, navigate, dispatch }) => {
    return (
        <>
            {products && <Slider className='custom-slider'  {...settings}>
                {products?.map((el, index) => (
                    <Product
                        key={index}
                        pid={el._id}
                        productData={el}
                        isNew={activeTab === 1 ? false : true}
                        normal={normal}
                        navigate={navigate}
                        dispatch={dispatch}
                    />
                ))}
            </Slider>}
        </>
    )
}

export default withBaseComponent(memo(CustomSlider))