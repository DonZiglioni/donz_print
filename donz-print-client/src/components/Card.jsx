import React from 'react';
import './Card.css'

const Card = ({ category }) => {
    return (
        <div className='Card'>
            <div>Image</div>
            <h2>{category}</h2>
            <p>Price</p>
        </div>
    )
}

export default Card