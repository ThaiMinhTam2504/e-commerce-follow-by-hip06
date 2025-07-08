import React, { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loader } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister, apiDeleteTemporaryAccount } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
import { showModel } from 'store/app/appSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helper'
import { AiOutlineHome } from 'react-icons/ai'


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: ''
    })
    const [isverifiedEmail, setIsverifiedEmail] = useState(false)
    const [token, setToken] = useState('')
    const [invalidFields, setInvalidFields] = useState([])
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const resetPayLoad = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const [email, setEmail] = useState('')
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        if (response.success) {
            toast.success(response.mes)

        } else {
            toast.info(response.mes)
        }
    }
    useEffect(() => {
        resetPayLoad()
    }, [isRegister])
    //SUBMIT

    const handleSubbmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload

        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
        // console.log(invalids)
        // console.log(payload)
        if (invalids === 0) {
            if (isRegister) {
                dispatch(showModel({ isShowModal: true, modalChildren: <Loader /> }))
                const response = await apiRegister(payload)
                // console.log(response);
                dispatch(showModel({ isShowModal: false, modalChildren: null }))
                if (response.success) {
                    setIsverifiedEmail(true)
                } else {
                    // Swal.fire('Opps!', JSON.stringify(response.mes), 'error') cách này cho người lười.
                    const errorMessage = typeof response.mes === 'string' ? response.mes : JSON.stringify(response.mes);
                    Swal.fire('Opps!', errorMessage, 'error');
                }
            } else {
                try {
                    const rs = await apiLogin(data)
                    if (rs.success) {
                        dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                        navigate(`/${path.HOME}`)
                    } else Swal.fire('Opps!', rs.mes, 'error')
                }
                catch (error) {
                    // Bắt lỗi HTTP (ví dụ 401)
                    const message = error?.response?.data?.mes || error.message || 'Login failed!';
                    Swal.fire('Opps!', message, 'error');
                }
            }
        }
    }, [payload, isRegister, navigate, dispatch])

    const finalRegister = async () => {
        const response = await apiFinalRegister(token)
        if (response.success) {
            Swal.fire('Congratulation', response.mes, 'success').then(() => {
                setIsRegister(false)
                resetPayLoad()
                setIsverifiedEmail(false)
            })
        } else {
            //Nếu mã xác nhận sai, xóa tài khoản tạm thời
            try {
                const deleteResponse = await apiDeleteTemporaryAccount(payload.email)
                if (deleteResponse.success) {
                    toast.success('Temporary account deleted due to invalid verification code.')
                } else {
                    toast.error('Failed to delete temporary account.')
                }
            } catch (error) {
                console.error('Error deleting temporary account:', error)
                toast.error('Something went wrong while deleting temporary account!')
            }
            Swal.fire('Opps!', response.mes, 'error')
            setIsverifiedEmail(false)
            setToken('')
        }
    }

    const handleCancelVerification = async () => {
        try {
            const response = await apiDeleteTemporaryAccount(payload.email)
            if (response.success) {
                toast.success('Temporary account deleted successfully.')
            } else {
                toast.error('Failed to delete temporary account.')
            }
        } catch (error) {
            console.error('Error deleting temporary account:', error)
            toast.error('Something went wrong!')
        } finally {
            setIsverifiedEmail(false)
            setToken('')
        }
    }
    return (
        <div className='w-screen h-screen relative'>
            {isverifiedEmail && <div className='absolute top-0 left-0 right-0 bottom-0 bg-black z-50 flex flex-col items-center justify-center bg-opacity-50'>
                <div className='bg-white w-[500px] rounded-md p-8 relative'>
                    <button
                        className='absolute top-2 right-2 text-gray-500 hover:text-black'
                        onClick={handleCancelVerification}
                    >
                        ✖
                    </button>
                    <h4 className=''>We sent a code to your email. Please check your email and enter your code below:</h4>
                    <input
                        type='text'
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className='p-2 border rounded-md outline-none'
                    />
                    <button
                        type='button'
                        className='px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4'
                        onClick={finalRegister}
                    >
                        Submit
                    </button>
                    <span className='flex flex-col pt-3 mb-0 text-red-500 font-semibold'>*Note: Always fill in the newest code from your mail.</span>
                </div>
            </div>}
            {isForgotPassword && <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white z-50 flex flex-col items-center py-8'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor='email'>Enter your Email:</label>
                    <input
                        type='text'
                        id="email"
                        className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                        placeholder='Ex: email@gmail.com'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className='flex items-center justify-end w-full gap-4'>
                        <Button
                            name='Submit'
                            handleOnClick={handleForgotPassword}
                            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                        />
                        <Button
                            name='Back'
                            handleOnClick={() => setIsForgotPassword(false)}
                        />
                    </div>
                </div>
            </div>}
            <img
                src="https://img.freepik.com/premium-photo/shopping-cart-card-icon-discounts_116441-26066.jpg"
                alt=""
                className='w-full h-full object-cover'
            />
            <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
                    <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister && <div className='flex items-center gap-2'>
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fullWidth={true}
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fullWidth={true}
                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth={true}
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth={true}
                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth={true}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleSubbmit()
                            }
                        }}
                    />
                    <Button
                        children={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubbmit}
                        fw
                    />
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
                        {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'
                            onClick={() => setIsRegister(true)}
                        >Create account</span>}
                        {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center'
                            onClick={() => setIsRegister(false)}
                        >Go Login</span>}
                    </div>
                    {/* <Link className=' text-sm text-blue-500 hover:underline cursor-pointer' to={`/${path.HOME}`}>Go home ?</Link> */}
                    <Link
                        className='flex items-center justify-center w-12 h-12 border-4 border-black-800 rounded-full text-blue-500 hover:bg-blue-500 hover:border-indigo-200 transition-all duration-300 ease-in-out hover:text-white cursor-pointer'
                        to={`/${path.HOME}`}
                    >
                        <AiOutlineHome size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login