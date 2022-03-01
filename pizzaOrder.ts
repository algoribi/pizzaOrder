import * as readline from "readline";
import * as utils from "util";
import menuJson from './menu.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = utils.promisify<string, string>((query, callback) => {
    return rl.question(query, (answer: string) => callback(undefined, answer));
}).bind(rl);

class TakeOrders {
    private orders = new Order();

    constructor() {
    }

    async userInput() {
        const regexr = /^[가-힣|0-9]{1,}$/;
        const regexr2 = /^[가-힣|0-9]{1,}[(](\s*[가-힣|0-9]{1,}\s*,)*\s*[가-힣|0-9]{1,}\s*[)]$/;
        
        while(true) {
            const userOrder: string = await question("> : ");
            
            if ((!regexr.test(userOrder) && !regexr2.test(userOrder))) { 
                this.inputGuidePrint();
            } else if (this.checkDone(userOrder)) {
                break;
            } else {
                let reg = userOrder.match(/[가-힣|0-9]{1,}/g);
                if (reg === null) {
                    this.inputGuidePrint();
                } else {
                    if (!this.orders.addOrder(reg)) {
                        this.inputGuidePrint();
                    }
                }
            }
        }
    }

    inputGuidePrint() {
        console.log(`[올바른 메뉴를 입력했는지 확인해 주세요!]`);
        console.log("* 메뉴는 상품명과 상품 코드를 통해 입력받습니다.");
        console.log("* 메뉴 사이에는 엔터(개행)를 입력해 주세요.");
        console.log("* 'Done'을 입력 시 주문을 종료합니다.\n");
    }
    
    checkDone(inputData: string) {
        return inputData.toLowerCase() === "done";
    }

    checkFalse(inputData: string) {
        return inputData.toLowerCase() === "false";
    }

    finishOrder() {
        this.orders.confirmOrder();
        rl.close();
    }
}

class Order {
    userPizzaOrders: PizzaMenu[] = [];
    userDrinkOrders: Menu[] = [];
    totalPrice: number = 0;

    addOrder(userInput: RegExpMatchArray) {
        let pizzaCategory: boolean = false;
        let pizza = new PizzaMenu("", 0, 0);

        for (let idx in userInput) {
            if (idx === "0") {
                let pizzaMenu = this.IsPizza(userInput[idx]);
                let drinkMenu = this.IsDrink(userInput[idx]);
                if (!this.IsNotFound(pizzaMenu.name)) {
                    pizzaCategory = true;
                    pizza = new PizzaMenu(pizzaMenu.name, pizzaMenu.productCode, pizzaMenu.price);
                } else if (!this.IsNotFound(drinkMenu.name)) {
                    this.userDrinkOrders.push(new Menu(drinkMenu.name, drinkMenu.productCode, drinkMenu.price));
                } else {
                    return false;
                }
            } else {
                let toppingMenu = this.IsTopping(userInput[idx]);
                if (!pizzaCategory || this.IsNotFound(toppingMenu.name) || !pizza.IsSameTopping(toppingMenu)) {
                    return false;
                } else {
                    pizza.toppings.push(new Menu(toppingMenu.name, toppingMenu.productCode, toppingMenu.price));
                    pizza.price += toppingMenu.price;
                }
            }
        }

        if (pizzaCategory) {
            this.userPizzaOrders.push(pizza);
            this.totalPrice += pizza.price;
        } else {
            this.totalPrice += this.userDrinkOrders[this.userDrinkOrders.length - 1].price;
        }

        return true;
    }

    IsPizza(input: string) {
        for (let pizza of menuJson.pizza) {
            if (pizza.name === input || pizza.productCode.toString() === input) {
                return pizza;
            }
        }
        return { name: "not found", productCode: 0, price: 0 };
    }
    
    IsDrink(input: string) {
        for (let drink of menuJson.drink) {
            if (drink.name === input || drink.productCode.toString() === input) {
                return drink;
            }
        }
        return { name: "not found", productCode: 0, price: 0 };
    }
    
    IsTopping(input: string) {
        for (let topping of menuJson.topping) {
            if (topping.name === input || topping.productCode.toString() === input) {
                return topping;
            }
        }
        return { name: "not found", productCode: 0, price: 0 };
    }
    
    IsNotFound(input: string) {
        return input === "not found";
    }
    
    confirmOrder() {
        console.log("\n[주문을 확인합니다.]"); 

        for (let order of this.userPizzaOrders) {
            order.printMenu();
        }

        for (let order of this.userDrinkOrders) {
            order.printMenu();
        }

        console.log(`-----------------------------\n => 총 금액 : ${this.totalPrice}원`);
        console.log("[주문을 종료합니다.]\n");
    }
}

class Menu {
    name : string;
    productCode : number;
    price: number;

    constructor(name: string, productCode: number, price: number) {
        this.name = name;
        this.productCode = productCode;
        this.price = price;
    }

    printMenu() { 
        console.log(`* ${this.name}(${this.productCode}) : ${this.price}`);
    }
}

class PizzaMenu extends Menu {
    toppings: Menu[] = [];
    
    constructor(name: string, productCode: number, price: number) {
        super(name, productCode, price);
    }

    IsSameTopping(topping : { name: string, productCode: number, price: number }) { 
        for (let tp of this.toppings) {
            if (tp.name === topping.name) {
                return false;
            }
        }
        
        return true;
    }

    printMenu() {
        console.log(`* ${this.name}(${this.productCode}) : ${this.price}`);
        if (this.toppings.length !== 0) {
            console.log(`   ㄴ 추가한 토핑 : `);
            for (let topping of this.toppings) {
                console.log(`   ${topping.name}(${topping.productCode})`);
            }
        }
    }
}

export {
    TakeOrders
}