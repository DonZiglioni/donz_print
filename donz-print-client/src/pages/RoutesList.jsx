import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import NewProducts from './NewProducts';
import OldProducts from './OldProducts'

const RoutesList = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/new' element={<NewProducts />} />
            <Route path='/expiring' element={<OldProducts />} />
        </Routes>
    )
}

export default RoutesList