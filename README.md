# Stock-Management System

StockMan is a simple app that helps you manage your inventory by displaying stock levels, add items and remove items from the system.
## Installation

Download source and run index.html


## Tests

```
Run /test/test.html to view tests 

Unit tests JavaScript at /test/StockManager.test.js
```

## Usage
Initiate StockManager in index.js by adding stock to the constructor.

Example :
```
 new StockManager({
          "Product 1": [{
                    "quantity": 12,
                    "averagePrice": "16.99",
                    "name": "Product 1"
                     }],
          "Product 2": [],
          "Product 3": []
         });
```