import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const [search,setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('tokenA')?localStorage.getItem('tokenA'):'');

    const addtoCart = async (itemId, size) => {
        if(!size){
            toast.error('Select Product size');
            return;
        }
        let cartData = structuredClone(cartItem);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);

        if(token){
            try{

                const response = await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}})
                console.log(response.data)

            }catch(e){
                console.log(e.message)
                toast.error(e.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItem){
            for(const item in cartItem[items]){
                try{
                    if(cartItem[items][item] > 0){
                        totalCount += cartItem[items][item];
                    }
                }catch(e){}
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem);

        cartData[itemId][size] = quantity;

        setCartItem(cartData);

        if(token){
            try{

                const response = await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})
                console.log(response.data)

            }catch(e){
                console.log(e.message)
                toast.error(e.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItem){
            let itemsInfo = products.find((product)=> product._id === items);
            for (const item in cartItem[items]){
                try{
                    if(cartItem[items][item] > 0){
                        totalAmount += itemsInfo.price * cartItem[items][item];
                    }
                }catch(e){
                     
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try{

            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
            }else{
                toast.error(response.data.message)
            }

        }catch(e){
            console.log(e.message)
            toast.error(e.message)
        }
    }

    const getUserCart = async ( token ) => {
        try{

            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
            if(response.data.success){
                setCartItem(response.data.cartData)
                toast.success(response.data.message)
            }else{
                toast.error(response.data.message)
            }
        }catch(e){
            console.log(e)
            toast.error(e.message)
        }
    }

    useEffect(()=>{
        getProductsData()
    },[]);

    useEffect(()=>{
        if(token){
            getUserCart(token)
        }
    },[]);

    const value ={
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItem,setCartItem, addtoCart,backendUrl,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        getProductsData, token, setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider