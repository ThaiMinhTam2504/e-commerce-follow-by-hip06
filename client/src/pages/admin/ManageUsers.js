import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis/user'
import { roles, blockStatus } from 'utils/contants'
import moment from 'moment'
import { InputField, Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { set, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import { use } from 'react'

const ManageUsers = () => {

    //định nghĩa payload mặc định cho useForm
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        phone: '',
        isBlocked: ''

    })


    const [users, setUsers] = useState(null)
    const [queries, setQueries] = useState({
        q: ""
    })
    const [update, setUpdate] = useState(false)
    const [editElem, setEditElem] = useState(null)
    const [params] = useSearchParams()
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) setUsers(response)
    }
    const queriesDebounce = useDebounce(queries.q, 800)
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        if (queriesDebounce) queries.q = queriesDebounce
        fetchUsers(queries)
    }, [queriesDebounce, params, update])



    const handleUpdate = async (data) => {
        const response = await apiUpdateUser(data, editElem._id)
        if (response.success) {
            setEditElem(null)
            render()
            toast.success(response.mes)
        } else {
            toast.error(response.mes || 'Update failed')
        }
    }

    const handleDeleteUser = async (uid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid)
                if (response.success) {
                    toast.success(response.mes)
                    render()
                } else {
                    toast.error(response.mes || 'Delete failed')
                }
            }
        })

        // const response = await apiUpdateUser(uid)
        // if (response.success) {
        //     toast.success(response.mes)
        //     render()
        // } else {
        //     toast.error(response.mes)
        // }
    }
    useEffect(() => {
        if (editElem) {
            reset({
                email: editElem.email,
                firstname: editElem.firstname,
                lastname: editElem.lastname,
                role: editElem.role,
                phone: editElem.phone,
                isBlocked: editElem.isBlocked
            })
        }
    }, [editElem, reset])
    return (
        <div className={clsx('w-full', editElem && 'pl-14')}>
            <h1 className='h-[75px] flex  justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Manage Users</span>
            </h1>
            <div className='w-full p-4 '>
                <div className='flex justify-end py-4'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style={'w500'}
                        placeholder={'Search user by email or name or phone number'}
                        isHideLabel={true}
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editElem && <Button type="submit">Update</Button>}
                    <table className='table-auto mb-6 text-left w-full'>
                        <thead className='text-white font-bold bg-gray-700 text-[13px] '>
                            <tr className='border border-gray-500'>
                                <th className='px-4 py-2 '>#</th>
                                <th className='px-4 py-2 '>Email address</th>
                                <th className='px-4 py-2 '>Firstname</th>
                                <th className='px-4 py-2 '>Lastname</th>
                                <th className='px-4 py-2 '>Role</th>
                                <th className='px-4 py-2 '>Phone</th>
                                <th className='px-4 py-2 '>Status</th>
                                <th className='px-4 py-2 '>Created At</th>
                                <th className='px-4 py-2 '>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((el, index) => (
                                <tr key={el._id} className='border border-gray-500'>
                                    <td className='py-2 px-4'>{index + 1}</td>
                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                defaultValue={editElem?.email}
                                                id='email'
                                                validate={{
                                                    required: true,
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address'
                                                    }
                                                }}
                                                fullWidth
                                                style={'w-[250px]'}

                                            />
                                            : <span>{el.email}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                defaultValue={editElem?.firstname}
                                                id='firstname'
                                                validate={{ required: 'Required field' }}
                                                fullWidth
                                            />
                                            : <span>{el.firstname}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                defaultValue={editElem?.lastname}
                                                id='lastname'
                                                validate={{ required: 'Required field' }}
                                                fullWidth
                                            />
                                            : <span>{el.lastname}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <Select
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                defaultValue={+el.role}
                                                id={'role'}
                                                validate={{ required: 'Required field' }}
                                                options={roles}
                                                style={'w-[110px]'}

                                            />
                                            : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}
                                    </td>

                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                defaultValue={editElem?.mobile}
                                                id='mobile'
                                                validate={{
                                                    required: 'Required field',
                                                    pattern: {
                                                        value: /^[62|0]+\d{9}/gi,
                                                        message: 'Invalid phone number'
                                                    }
                                                }}
                                                fullWidth
                                                style={'w-[110px]'}
                                            />
                                            : <span>{el.mobile}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editElem?._id === el._id
                                            ? <Select
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                defaultValue={el.isBlocked}
                                                id={'isBlocked'}
                                                validate={{ required: 'Required field' }}
                                                options={blockStatus}
                                                style={'w-[110px]'}

                                            />
                                            : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                                    </td>

                                    <td className='py-2 px-4'>{moment(el.createdAt).format('MM/DD/YYYY')}</td>
                                    <td>
                                        {editElem?._id === el._id ? <span onClick={() => setEditElem(null)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span>
                                            : <span onClick={() => setEditElem(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>}
                                        <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                <div className='w-full flex justify-end'>
                    <Pagination
                        totalCount={users?.counts}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManageUsers