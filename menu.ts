const menus : { [key : string] : { [key: string] : { first : string, second : number } } } = {
    pizzaName :  {
        "갈릭버터쉬림프" : {first : "10001", second : 29900},
        "수퍼슈프림" : {first : "10002", second : 28900},
        "호박고구마" : {first : "10003", second : 22500},
        "불고기" : {first : "10004", second : 22500},
        "페페로니" : {first : "10005", second : 16900}
    },
    pizzaProductCode : {
        "10001" : { first : "갈릭버터쉬림프", second : 29900},
        "10002" : { first : "수퍼슈프림", second : 28900},
        "10003" : { first : "호박고구마", second : 22500},
        "10004" : { first : "불고기", second : 22500},
        "10005" : { first : "페페로니", second : 16900}
    },

    drinkName :  {
        "콜라" : {first : "10006", second : 1500},
        "사이다" : {first : "10007", second : 1000},
        "환타" : {first : "10008", second : 2000}
    },
    drinkProductCode : {
        "10006" : { first : "콜라", second : 1500},
        "10007" : { first : "사이다", second : 1000},
        "10008" : { first : "환타", second : 2000}
    },

    toppingName :  {
        "치즈" : {first : "10009", second : 500},
        "새우" : {first : "10010", second : 700},
        "감자" : {first : "10011", second : 300}
    },
    toppingProductCode : {
        "10009" : { first : "치즈", second : 500},
        "10010" : { first : "새우", second : 700},
        "10011" : { first : "감자", second : 300}
    }
}

export {
    menus
}