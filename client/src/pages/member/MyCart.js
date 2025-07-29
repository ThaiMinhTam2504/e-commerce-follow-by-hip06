import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'

const MyCart = (props) => {
    console.log(props) // This will log the props passed to MyCart, including 'test_HOC'
    // You can use props as needed in your component logic
    return (
        <div onClick={() => props.navigate('/')}>MyCart</div>
    )
}

export default withBaseComponent(MyCart)