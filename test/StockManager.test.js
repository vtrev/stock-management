describe('StockManager', () => {

    it('Should allow to initialise stock manager with only 3 products', () => {
        assert.doesNotThrow(() => {
            new StockManager({
                    "Product 1": [],
                    "Product 2": [],
                    "Product 3": []
                }),
                Error, 'Only 3 Products can be added to the system.'
        })
    })

    it('Should reject less than 3 products into the system upon initialisation', () => {
        assert.throws(() => {
            new StockManager({
                "Product 1": []
            })
        }, Error, 'Only 3 Products can be added to the system.')
    })

    it('Should reject more than 3 products into the system upon initialisation', () => {
        assert.throws(() => {
            new StockManager({
                "Product 1": [],
                "Product 2": [],
                "Product 3": [],
                "Product 4": [],
            })
        }, Error, 'Only 3 Products can be added to the system.')
    })

});


describe('addStockItems', () => {

    let stockManager = new StockManager({
        "Product 1": [],
        "Product 2": [],
        "Product 3": []
    });

    it('Should add stock for valid product code, quantity and price', () => {
    
        assert.equal(stockManager.addStockItems("Product 1", 12, 16.99),"Added 12 item(s) of Product 1  @ R16.99 to the system successfully.");    
        assert.deepEqual(stockManager.getStockLevels(),{
            "Product 1": {
                "quantity": 12,
                "averagePrice": "16.99",
                "name": "Product 1"
            },
            "Product 2": {
                "quantity": "Out of stock",
                "name": "Product 2"
            },
            "Product 3": {
                "quantity": "Out of stock",
                "name": "Product 3"
            }
        });
    });

    it('Should return an error for invalid product code', () => {

        assert.equal(stockManager.addStockItems("Some Product Code", 12, 45.99), "Error : Please select a valid product code from the drop down.")
    });


    it('Should return an error when input is invalid for quantity', () => {

        assert.equal(stockManager.addStockItems("Product 1", "String Quantity", 56.00), "Error : Invalid input, please check your quantity.")
    });


    it('Should return an error when input is invalid for price', () => {

        assert.equal(stockManager.addStockItems("Product 1", 9, "non valid price"), "Error : Invalid input, please check your price.")
    });
});


describe('removeStockItems', () => {


    it('Should reduce the stock given valid product code and quantity that is available', () => {
        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        stockManager.addStockItems("Product 1", 10, 56.99);
        assert.equal(stockManager.removeStockItems("Product 1", 6, "japal@mail.ru"), "6 item(s) of Product 1 have been removed successfully.")
        // verify reduction by checking current stock level is reduced by 6 items
        assert.deepEqual(stockManager.getStockLevels(), {
            "Product 1": {
                "quantity": 4,
                "averagePrice": "56.99",
                "name": "Product 1"
            },
            "Product 2": {
                "quantity": "Out of stock",
                "name": "Product 2"
            },
            "Product 3": {
                "quantity": "Out of stock",
                "name": "Product 3"
            }
        });
    });

    it('Should reject  email address from removing stock more than once.', () => {
        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        stockManager.addStockItems("Product 1", 10, 56.99);
        stockManager.addStockItems("Product 2", 15, 6.99);
        stockManager.addStockItems("Product 1", 5, 10.56);

        assert.equal(stockManager.removeStockItems("Product 1", 4, "user@mail.com"), "4 item(s) of Product 1 have been removed successfully.")

        //trying to buy items with same email address should result in an error
        assert.equal(stockManager.removeStockItems("Product 2", 6, "user@mail.com"), "Error : Email address user@mail.com has already been used to purchase on this system.")

    })

    it('Should reduce the stock given product code and quantity that is available at different prices', () => {

        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        stockManager.addStockItems("Product 1", 10, 56.99);
        stockManager.addStockItems("Product 1", 5, 60.00);
        stockManager.addStockItems("Product 1", 15, 10.00);

        assert.equal(stockManager.removeStockItems("Product 1", 25), "25 item(s) of Product 1 have been removed successfully.")

        // verify reduction by checking current stock level is reduced by 25 items from different prices
        assert.deepEqual(stockManager.getStockLevels(), {
            "Product 1": {
                "quantity": 5,
                "averagePrice": "10.00",
                "name": "Product 1"
            },
            "Product 2": {
                "quantity": "Out of stock",
                "name": "Product 2"
            },
            "Product 3": {
                "quantity": "Out of stock",
                "name": "Product 3"
            }
        });
    });

    it('Should return an error for invalid product code', () => {
        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        assert.equal(stockManager.removeStockItems("Some Product Code", 12, 45.99), "Error : Invalid Input, please verify your product code.")
    });


    it('Should return an error when quantity required is not a valid number', () => {
        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        assert.equal(stockManager.removeStockItems("Product 1", "String Quantity", 56.00), "Error : Invalid Input, please verify your quantity.")
    });

});


describe('getStockLevels', () => {

    let stockManager = new StockManager({
        "Product 1": [],
        "Product 2": [],
        "Product 3": []
    });

    stockManager.addStockItems("Product 1", 10, 56.99);
    stockManager.addStockItems("Product 1", 5, 60.00);
    stockManager.addStockItems("Product 1", 15, 10.00);
    stockManager.addStockItems("Product 2", 15, 44.95);
    stockManager.addStockItems("Product 3", 30, 5.00);
    stockManager.addStockItems("Product 3", 10, 10.00);

    it('Should return stock levels for the products in the system', () => {
        assert.deepEqual(stockManager.getStockLevels(), {
            "Product 1": {
                "quantity": 30,
                "averagePrice": "42.33",
                "name": "Product 1"
            },
            "Product 2": {
                "quantity": 15,
                "averagePrice": "44.95",
                "name": "Product 2"
            },
            "Product 3": {
                "quantity": 40,
                "averagePrice": "7.50",
                "name": "Product 3"
            }
        });

    });

    it('Should return an out of stock message if there is no items available', () => {
        let stockManager = new StockManager({
            "Product 1": [],
            "Product 2": [],
            "Product 3": []
        });

        assert.equal(stockManager.removeStockItems("Product 1", 2, 56.00), "Error : Product 1 is out of stock.")
    });
});