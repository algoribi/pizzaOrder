import * as readline from "readline";
import * as utils from "util";
import { menu } from './menu';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = utils.promisify<string, string>((query, callback) => {
    return rl.question(query, (answer: string) => callback(undefined, answer));
}).bind(rl);

interface MenuType {
    name : string;
    productCode : string;
    price : number;
    topping? : string[];
}

function finishOrder() {
    rl.close();
}

async function pizzaOrder() {
    printMenu();
    const userOrderMenus : MenuType[] = [];

    console.log("\n['Done'을 입력할 때까지 주문을 받습니다.\n메뉴(이름 혹은 상품 코드)를 입력해 주세요.]");

    while(true) {
        const userInput : string = await question("> : ");

        if (checkDone(userInput)) {
            confirmOrder(userOrderMenus);
            console.log("[주문을 종료합니다.]\n");
            break;
        } else {
            const returnMenuType : MenuType = cheakUserInput(userInput);

            if (!cheakUndefined(returnMenuType.name)) {
                userOrderMenus.push(returnMenuType);
            } else {
                inputGuidePrint(userInput);
            }
        }
    }
}

function printMenu() {
    console.log("---------- Menu ----------");
    console.log("[pizza]");
    
    for (let key in menu.pizzaName) {
        console.log(`* ${key}(${menu.pizzaName[key].first}) : ${menu.pizzaName[key].second}`);
    }
    console.log("[drink]");
    for (let key in menu.drinkName) {
        console.log(`* ${key}(${menu.drinkName[key].first}) : ${menu.drinkName[key].second}`);
    }
}

function cheakUserInput(userInput : string) {
    for (let key in menu) {
        if (menu[key][userInput] !== undefined && /Name/.test(key)) {
            return {name : userInput, productCode : menu[key][userInput].first, price : menu[key][userInput].second, topping : []};
        } else if (menu[key][userInput] !== undefined) {
            return {name : menu[key][userInput].first, productCode : userInput, price : menu[key][userInput].second, topping : []};
        }
    }

    return {name : "undefined", productCode : "undefined", price : 0};
}  

function confirmOrder(userOrderMenus : MenuType[]) {
    console.log("\n[주문을 확인합니다.]"); 

    let totalPrice = userOrderMenus.reduce((sumPrice : number, orderMenu : MenuType) => {
        console.log(`* ${orderMenu.name}(${orderMenu.productCode}) : ${orderMenu.price}원`);
        return sumPrice + orderMenu.price;
    }, 0);

    console.log(`\n => 총 금액 : ${totalPrice}원`);
}

function cheakUndefined(inputString : string) {
    return inputString === 'undefined';
}

function checkDone(userInput : string) {
    return userInput.toLowerCase() === 'done';
}

function inputGuidePrint(userInput : string) {
    console.log(`['${userInput}'은 없는 메뉴입니다. 올바른 메뉴를 입력하셨는지 확인해 주세요!]`);
    console.log("* 메뉴는 상품명과 상품 코드를 통해 입력받습니다.");
    console.log("* 메뉴 사이에는 엔터(개행)를 입력해 주세요.");
    console.log("* 'Done'을 입력 시 주문을 종료합니다.\n");
}

export {
    pizzaOrder,
    finishOrder
}