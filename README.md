# Stock-Management System

StockMan is a simple app that helps you manage your inventory by displaying stock levels, add items and remove items from the system.
## How to run

Download source and run index.html

NB: Internet connection is needed to fetch some files from a cdn.


## Tests

```
Run /test/test.html to view tests.

Unit tests JavaScript at /test/StockManager.test.js
```

## Usage
Initiate StockManager in index.js by adding stock to the constructor.

Example :
```
 new StockManager({
          "Product 1": [{"price": Number(399.99).toFixed(2),
                "quantity":80
            }],
          "Product 2": [],
          "Product 3": []
         });

NB: Price should be cast into a number if manual stock is added, adding stock items manually is optional.
```

## Live website (stockman-ts branch)

https://vusi.world/stock-management/index.html
