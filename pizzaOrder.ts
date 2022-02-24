import * as readline from "readline";
import * as utils from "util";
import { Menu, MenuMap } from './makeMenu';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = utils.promisify(rl.question).bind(rl);

function finishOrder() {
    rl.close();
}

async function pizzaOrder<T>(myRestaurantMenu : MenuMap) {
    myRestaurantMenu.printMenu();
    const userOrderMenus : T = [];

    console.log("\n['Done'을 입력할 때까지 주문을 받습니다.\n메뉴(이름 혹은 상품 코드)를 입력해 주세요.]");

    while(true) {
        const userInput : T = await question("* : ");
        
        if (myRestaurantMenu.hasNameKey(userInput)) {
            userOrderMenus.push(myRestaurantMenu.getNameKey(userInput));
        } else if (myRestaurantMenu.hasProductCodeKey(parseInt(userInput))) {
            userOrderMenus.push(myRestaurantMenu.getProductCodeKey(parseInt(userInput)));
        } else if (checkDone(userInput)) {
            confirmOrder(userOrderMenus);
            console.log("[주문을 종료합니다.]\n");
            break;
        } else {
            inputGuidePrint(userInput);
        }
    }
}

function confirmOrder(userOrderMenus : Menu[]) {
    console.log("\n[주문을 확인합니다.]"); 

    let totalPrice = userOrderMenus.reduce((sumPrice : number, orderMenu : Menu) => {
        console.log(`* ${orderMenu.name}(${orderMenu.productCode}) : ${orderMenu.price}원`);
        return sumPrice + orderMenu.price;
    }, 0);

    console.log(`\n => 총 금액 : ${totalPrice}원`);
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