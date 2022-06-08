import { useReducer } from 'react'
import CartContext from './cart-context'

const defaultCartState={
    items:[],
    totalAmount:0,
}

const cartReducer = (state,action)=>{
    let updatedItems;

    if(action.type==="ADD"){
        const updatedTotalAmount = state.totalAmount+action.item.price*action.item.amount;
        
        const existingCartItemIndex=state.items.findIndex((item)=> item.id===action.item.id)
        const existingCartItem=state.items[existingCartItemIndex]


        if(existingCartItem){
            const updateItem={
                ...existingCartItem,
                amount:existingCartItem.amount+action.item.amount
            }

            updatedItems = [...state.items]
            updatedItems[existingCartItemIndex] = updateItem
        }else{
            updatedItems=state.items.concat(action.item)
        }

        return {
            items:updatedItems,
            totalAmount:updatedTotalAmount
        }
        
    }else if(action.type==='REMOVE'){
        
        const mealIndex = state.items.findIndex((item)=>item.id===action.id)
        const updatedTotalAmount=state.totalAmount-state.items[mealIndex].price

        if(state.items[mealIndex].amount===1){
            updatedItems=state.items.filter(item=>item.id!==action.id)
        }else{
            state.items[mealIndex].amount-=1;
            updatedItems = [...state.items]
        }


            return {
                items:updatedItems,
                totalAmount:updatedTotalAmount
            }
        
    }

    

}

const CartProvider = props =>{

    const [cartState,dispatchCartAction] = useReducer(cartReducer,defaultCartState);

    const addItemToCartHandler = item =>{
        dispatchCartAction({type:'ADD',item:item});
    }

    const removeItemFromCartHandler = id =>{
        dispatchCartAction({type:'REMOVE',id:id})
    }

    const cartContext = {
        items:cartState.items,
        totalAmount:cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler
    }

    return <CartContext.Provider value={cartContext}>
        {props.children}
    </CartContext.Provider>
}

export default CartProvider