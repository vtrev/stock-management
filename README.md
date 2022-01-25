# Stock-Management System

StockMan is a simple app that helps you manage your inventory by displaying stock levels, add items and remove items from the system.
## How to run

1. Setup TypeScript using instructions from : https://www.typescriptlang.org/download

2. Download source, run tsc to envoke the TypeScript compiler.

3. Open index.html file on browser to use the webpage.

NB: Internet connection is needed to fetch some files from a cdn.


## Tests

```
Open /test/test.html in browser to view tests.

Unit tests JavaScript at /test/StockManager.test.js
```

## Usage
Initiate StockManager in index.js by adding stock to the constructor using a map.

Example :
```
let productMap = new Map();
    productMap.set("Product Name", [{
            "price": 10999,
            "quantity": 20
        }]);
    productMap.set("Product 2", []);
    productMap.set("Product 3", []);

 new StockManager(productMap);

NB: Adding stock items manually is optional.
```

## Live website

https://vusi.world/stock-management/index.html
