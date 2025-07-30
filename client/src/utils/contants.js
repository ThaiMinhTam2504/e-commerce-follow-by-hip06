import path from "./path"
import icons from "./icons"
import { FaCartPlus, FaHeart, FaHome, FaInfoCircle } from "react-icons/fa"
// import { type } from "@testing-library/user-event/dist/types/utility"


export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'ALL PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQs}`
    },
]

const { RiTruckFill, BsShieldShaded, BsReplyFill, AiFillGift, FaTty } = icons
export const productExtraInfomation = [
    {
        id: 1,
        title: 'Guarantee',
        sub: 'Quality Checked',
        icon: <BsShieldShaded />
    },
    {
        id: 2,
        title: 'Free Shipping',
        sub: 'Free on All Products',
        icon: <RiTruckFill />
    },
    {
        id: 3,
        title: 'Special Gift Cards',
        sub: 'Special Gift Cards',
        icon: <AiFillGift />
    },
    {
        id: 4,
        title: 'Free Return',
        sub: 'Within 7 days',
        icon: <BsReplyFill />
    },
    {
        id: 5,
        title: 'Consultancy',
        sub: 'Lifetime 24/7/365 Support',
        icon: <FaTty />
    }
]

export const productInfoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: GSM /HSPA / LTE
        Dimensions: 158.5 x 73.6 x 7.9 mm (6.24 x 2.90 x 0.31 in)
        Weight: 172 g (6.07 oz)
        Display: Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits (HBM), 1200 nits (peak)
        Resolution: 1170 x 2532 pixels, 19.5:9 ratio (~460 ppi density)
        OS: iOS 14.1, upgradable to iOS 14.2
        Chipset: Apple A14 Bionic (5 nm)
        CPU: Hexa-core (2x3.1 GHz Firestorm + 4x1.8 GHz Icestorm)
        Internal: 64GB 4GB RAM, 128GB 4GB RAM, 256GB 4GB RAM
        Camera: 12 MP, f/1.6, 26mm (wide), 1.4µm, dual pixel PDAF, OIS`
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `WARRANTY DESCRIPTION
        1. The warranty period is 12 months from the date of purchase.
        2. The warranty covers all defects in materials and workmanship.
        3. The warranty does not cover the following cases:
        - Damage caused by misuse, abuse, or other abnormal use.
        - Damage caused by improper installation or operation.`
    }
    , {
        id: 3,
        name: 'DELIVERY',
        content: `DELIVERY INFORMATION
        1. The delivery time is 2-3 days.
        2. The delivery fee is $5.
        3. The delivery is free for orders over $50.
        4. The delivery is available in all 50 states.`
    }
    , {
        id: 4,
        name: 'PAYMENT',
        content: `PAYMENT INFORMATION
        1. We accept all major credit cards.
        2. We accept PayPal.
        3. We accept Cash on Delivery.
        4. We accept Bank Transfer.
        5. We accept Apple Pay.
        6. We accept Google Pay.
        7. We accept Samsung Pay.`
    }

]

export const colors = [
    'black',
    'brown',
    'gray',
    'white',
    'yellow',
    'orange',
    'purple',
    'green',
    'blue',
]

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best Selling'
    },
    {
        id: 2,
        value: '-title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: 'title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price,high to low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new'
    }
]

export const voteOptions = [
    {
        id: 1,
        text: 'Terrible',
    },
    {
        id: 2,
        text: 'Bad',
    },

    {
        id: 3,
        text: 'Neutral',
    },

    {
        id: 4,
        text: 'Good',
    },

    {
        id: 5,
        text: 'Perfect',
    },
]

const { AiOutlineDashboard,
    MdGroups,
    TbBrandProducthunt,
    RiBillLine,
} = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard size={20} />
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage Users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups size={20} />
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        icon: <TbBrandProducthunt size={20} />,
        submenu: [
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
            },
            {
                text: 'Manage Products',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            }
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20} />
    }

]

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Personal Information',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <FaInfoCircle size={20} />
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'My Cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <FaCartPlus size={20} />
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Buy History',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <RiBillLine size={20} color="black" />
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Wishlist',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <FaHeart size={20} />
    },
    {
        id: 5,
        type: 'SINGLE',
        text: 'Back to Home',
        path: `/`,
        icon: <FaHome size={20} />
    }

]

export const roles = [
    {
        code: 0,
        value: 'Admin'
    },
    {
        code: 1,
        value: 'User'
    }
]

export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    }
]