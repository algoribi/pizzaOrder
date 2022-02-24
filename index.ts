import { pizzaOrder, finishOrder } from './pizzaOrder';
import { MenuMap, makeMenu } from './makeMenu';

// import * as menus from "./myRestaurantMenu.json";
import * as menus from "./test.json";

let names : string = "페페로니";

console.log(menus.pizzaName.names);

/*
menus.pizza.forEach((data) => {
    console.log(`* ${data.name}(${data.productCode}) : ${data.price}`);
});
menus.drink.forEach((data) => {
    console.log(`* ${data.name}(${data.productCode}) : ${data.price}`);
});
menus.topping.forEach((data) => {
    console.log(`* ${data.name}(${data.productCode}) : ${data.price}`);
});
*/
/*
async function mainOrder() {
    const myRestaurantMenu : MenuMap = makeMenu();
    
    await pizzaOrder(myRestaurantMenu);
    finishOrder();
}

mainOrder();
*/