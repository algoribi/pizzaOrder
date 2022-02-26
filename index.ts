import {  TakeOrders } from './pizzaOrder';

async function mainOrder() {
    const userOrder = new TakeOrders();
    
    await userOrder.userInput();
    userOrder.finishOrder();
}

mainOrder();