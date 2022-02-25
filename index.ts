import { pizzaOrder, finishOrder } from './pizzaOrder';

async function mainOrder() {
    await pizzaOrder();
    finishOrder();
}

mainOrder();