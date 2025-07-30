// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { apiGetProducts } from '../../apis';
// import { Product } from '../../components';

// const ProductCategory = () => {
//     const { category } = useParams();
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetch = async () => {
//             const res = await apiGetProducts({ category });
//             if (res.success) setProducts(res.products);
//         };
//         fetch();
//     }, [category]);

//     return (
//         <div className="w-main m-auto mt-8">
//             <h2 className="text-2xl font-bold mb-4">{category}</h2>
//             <div className="grid grid-cols-4 gap-4">
//                 {products.map(product => (
//                     <Product key={product._id} productData={product} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductCategory;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { apiGetProducts } from '../../apis';
// import { Product, Breadcrumb } from '../../components'; // Thêm Breadcrumb

// const ProductCategory = () => {
//     const { category } = useParams();
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetch = async () => {
//             const res = await apiGetProducts({ category });
//             if (res.success) setProducts(res.products);
//         };
//         fetch();
//     }, [category]);

//     return (
//         <div className="w-full">
//             <div className="h-[81px] flex justify-center items-center bg-gray-100">
//                 <div className="w-main">
//                     <h3 className="font-semibold uppercase">{category}</h3>
//                     <Breadcrumb category={category} />
//                 </div>
//             </div>
//             <div className="w-main m-auto mt-8">
//                 <div className="grid grid-cols-4 gap-4">
//                     {products.map(product => (
//                         <Product key={product._id} productData={product} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCategory;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { apiGetProducts } from '../../apis';
import { Product, Breadcrumb, SearchItem, InputSelect, Pagination } from '../../components';
import { sorts } from '../../utils/contants';

const ProductCategory = () => {
    const { category } = useParams();
    const [products, setProducts] = useState(null);
    const [activeClick, setActiveClick] = useState(null);
    const [params] = useSearchParams();
    const [sort, setSort] = useState('');
    const navigate = useNavigate();

    // Lấy sản phẩm theo category + filter/sort
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        let priceQuery = {};

        if (queries.to && queries.from) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } }
                ]
            };
            delete queries.price;
        } else {
            if (queries?.from) queries.price = { gte: queries.from };
            if (queries?.to) queries.price = { lte: queries.to };
        }

        delete queries.to;
        delete queries.from;
        const q = { ...priceQuery, ...queries, category };

        const fetch = async () => {
            const res = await apiGetProducts(q);
            if (res.success) setProducts(res);
        };
        fetch();
        window.scrollTo(0, 0);
    }, [params, category]);

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null);
        else setActiveClick(name);
    }, [activeClick]);

    const changeValue = useCallback((value) => {
        setSort(value);
    }, [sort]);

    // Xử lý sort
    useEffect(() => {
        if (sort) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    sort: sort
                }).toString()
            });
        }
    }, [sort, category, navigate]);

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div>
                <div className='w-main border p-4 flex justify-between mt-8 m-auto'>
                    <div className='w-4/5 flex-auto flex flex-col gap-3'>
                        <span className='font-semibold text-sm'>Filter By</span>
                        <div className='flex items-center gap-4'>
                            <SearchItem
                                name='price'
                                activeClick={activeClick}
                                changeActiveFilter={changeActiveFilter}
                                type='input'
                            />
                            <SearchItem
                                name='color'
                                activeClick={activeClick}
                                changeActiveFilter={changeActiveFilter}
                            />
                        </div>
                    </div>
                    <div className='w-1/5 flex flex-col gap-3 '>
                        <span className='font-semibold text-sm'>Sort by</span>
                        <div className='w-full'>
                            <InputSelect
                                value={sort}
                                options={sorts}
                                changeValue={changeValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 w-main m-auto">
                    <div className="grid grid-cols-4 gap-4">
                        {products?.products?.map(product => (
                            <Product key={product._id} productData={product} />
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-main m-auto my-4 flex justify-end'>
                <Pagination totalCount={products?.counts} />
            </div>
            <div className='w-full h-[500px]'></div>
        </div>
    );
};

export default ProductCategory;