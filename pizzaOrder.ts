import * as readline from "readline";
import * as utils from "util";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = utils.promisify<string, string>((query, callback) => {
    return rl.question(query, (answer: string) => callback(undefined, answer));
}).bind(rl);

interface MenuType {
    name : string;
    productCode : number;
    price: number;
    toppingsName : string[];
}

class TakeOrders {
    private menu = new Menu();
    private orders = new Order();

    constructor() {
        this.menu.printMenu();
        console.log("\n['Done'을 입력할 때까지 주문을 받습니다.\n메뉴(이름 혹은 상품 코드)를 입력해 주세요.]");
    }

    async userInput() {
        const regexr = /[가-힣|0-9]{1,}/g;

        while(true) {
            const userOrder: string = await question("> : ");

            if (this.checkDone(userOrder)) {
                break;
            } else {
                let reg = userOrder.match(regexr);
                if (reg === null) {
                    this.inputGuidePrint();
                } else {
                    const menuData: MenuType = this.menu.findMenu(reg); // 유저의 입력이 유효한 메뉴인지 검사
                    if (!this.checkFalse(menuData.name)) {
                        this.orders.requestOrder(menuData);
                    } else {
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
    private userOrders: MenuType[] = [];
    private totalPrice: number = 0;

    requestOrder(inputOrder: MenuType) { 
        this.userOrders.push(inputOrder);
        this.totalPrice += inputOrder.price;
    }

    confirmOrder() {
        console.log("\n[주문을 확인합니다.]"); 

        for (let order of this.userOrders) {
            console.log(`* ${order.name}(${order.productCode}) : ${order.price}원`);
            if (order.toppingsName.length > 0) {
                console.log(`   ㄴ 추가한 토핑 : ${order.toppingsName}`);
            }
        }

        console.log(`-----------------------------\n => 총 금액 : ${this.totalPrice}원`);
        console.log("[주문을 종료합니다.]\n");
    }
}

class Menu {
    // productCode의 첫 번째 자릿수의 값으로 메뉴의 카테고리(피자 : 1xxxx, 음료 : 2xxxx, 토핑 : 3xxxx)를 알 수 있다.
    private menus: MenuType[] = [
        { name : "갈릭버터쉬림프", productCode : 10001, price : 29900, toppingsName : [] },
        { name : "호박고구마", productCode : 10003, price : 22500, toppingsName : [] },
        { name : "불고기", productCode : 10004, price : 22500, toppingsName : [] },
        { name: "페페로니", productCode: 10005, price: 16900 , toppingsName : [] },
        { name : "환타", productCode : 20003, price: 2000 , toppingsName : [] },
        { name : "치즈", productCode : 30001, price : 500, toppingsName : [] },
        { name : "수퍼슈프림", productCode : 10002, price : 28900, toppingsName : [] },
        { name : "콜라", productCode : 20001, price : 1500, toppingsName : [] },
        { name : "새우", productCode : 30002, price : 700, toppingsName : [] },
        { name : "사이다", productCode : 20002, price : 1000, toppingsName : [] },
        { name: "감자", productCode: 30003, price: 300 , toppingsName : [] }
    ];
    private mapMenuName = new Map<string, number>();
    private mapMenuProductCode = new Map<number, number>();

    constructor() {
        this.menus.sort((a: MenuType, b: MenuType) => { 
            return a.productCode - b.productCode;
        });

        for (let idx in this.menus) {
            this.mapMenuName.set(this.menus[idx].name, parseInt(idx));
            this.mapMenuProductCode.set(this.menus[idx].productCode, parseInt(idx));
        }
    }

    printMenu() {
        const category: string[] = ["[pizza]", "[drink]", "[topping]"];
        let categoryIdx = 0;

        console.log("---------- Menu ----------");
        for (let idx in this.menus) {
            // 카테고리를 출력하기 위한 if문
            if (idx === "0" || Math.floor(this.menus[idx].productCode / 10000) !== Math.floor(this.menus[parseInt(idx) - 1].productCode / 10000)) {
                console.log(category[categoryIdx]);
                categoryIdx++;
            }
            console.log(`* ${this.menus[idx].name}(${this.menus[idx].productCode}) : ${this.menus[idx].price}원`);
        }
    }

    findMenu(orderArr: RegExpMatchArray) {
        let menuData: MenuType = { name : "false", productCode : 0, price : 0, toppingsName : [] };

        orderArr.forEach((order, i) => {
            let idx: number | false = this.getMap(order);
            
            if ((i === 0 && idx !== false) && Math.floor(this.menus[idx].productCode / 10000) !== 3) {
                menuData = { name: this.menus[idx].name, productCode: this.menus[idx].productCode, price: this.menus[idx].price, toppingsName : [] };
            } else if ((Math.floor(menuData.productCode / 10000) === 1 && idx !== false) && Math.floor(this.menus[idx].productCode / 10000) === 3) {
                menuData.toppingsName.push(this.menus[idx].name + "(" + this.menus[idx].productCode.toString() + ")");
                menuData.price += this.menus[idx].price;
            } else {
                menuData.name = "false";
                return menuData;
            }
        });

        if (menuData.toppingsName.length > 0 && !this.checkSameTopping(menuData.toppingsName)) {
            menuData.name = "false";
        }

        return menuData;
    }

    checkSameTopping(toppings : string[]) { // 중복되는 토핑이 입력으로 들어왔는지 검사
        const uniqueArr = [...new Set(toppings)];
        if (toppings.length === uniqueArr.length) {
            return true;
        } else {
            return false;
        }
    }

    getMap(order: string) {
        const mapNameResult: number | undefined = this.mapMenuName.get(order);
        const mapProductCodeResult: number | undefined = this.mapMenuProductCode.get(parseInt(order));
        
        if (mapNameResult !== undefined) {
            return mapNameResult;
        } else if (mapProductCodeResult !== undefined) {
            return mapProductCodeResult;
        } else {
            return false;
        }
    }
}

export {
    TakeOrders
}