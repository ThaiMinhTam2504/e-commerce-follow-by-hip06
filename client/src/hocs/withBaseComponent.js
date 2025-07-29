import React from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const withBaseComponent = (Component) => (props) => {

    // This is a higher-order component that wraps the given Component
    // It can be used to add additional functionality or props to the Component
    // For example, you could add a base className or some common props here
    // For now, it simply renders the Component with the given props


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    return <Component {...props} navigate={navigate} dispatch={dispatch} location={location} />
}

export default withBaseComponent