class Menu {
    name : string;
    productCode : number;
    price: number;

    constructor(name : string, productCode : number, price : number) {
        this.name = name;
        this.productCode = productCode;
        this.price = price;
    }
}

class MenuMap {
    private mapMenuName = new Map<string, Menu>();
    private mapMenuProductCode = new Map<number, Menu>();

    constructor(menuArr : Menu[]) {
        for (let food of menuArr) {
            this.mapMenuName.set(food.name, new Menu(food.name, food.productCode, food.price));
            this.mapMenuProductCode.set(food.productCode, new Menu(food.name, food.productCode, food.price));
        }
    }

    getNameKey(key : string) {
        return this.mapMenuName.get(key);
    }

    getProductCodeKey(key : number) {
        return this.mapMenuProductCode.get(key);
    }

    hasNameKey(key : string) {
        return this.mapMenuName.has(key);
    }

    hasProductCodeKey(key : number) {
        return this.mapMenuProductCode.has(key);
    }

    printMenu() {
        console.log("---------- Menu ----------");

        for (let [key, value] of this.mapMenuName) {
            console.log(`* ${value.name}(${value.productCode}) : ${value.price}원`);
        }
    }
}

function makeMenu() {
    const menus : Menu[] = [new Menu("갈릭버터쉬림프", 10001, 29900),
        new Menu("수퍼슈프림", 10002, 28900),
        new Menu("스파이시불고기", 10003, 22500),
        new Menu("호박고구마", 10004, 22500),
        new Menu("페페로니", 10005, 16900),
        new Menu("콜라", 10006, 1500),
        new Menu("사이다", 10007, 1000),
        new Menu("환타", 10008, 2000)];
    
    return new MenuMap(menus);
}

export {
    Menu,
    MenuMap,
    makeMenu
}