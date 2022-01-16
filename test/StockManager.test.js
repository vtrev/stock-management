describe('addProduct',  () => {

    let stockManager = new StockManager();

	it('Should add a product that does not exist if there are less than 3 products in the system', () => {
        stockManager.addProduct("Test Product 1");
        assert.equal(stockManager.getProduct("Test Product 1"),"Test Product 1")
	});

    it('Should return an error if the product is already in the system', () => {
        stockManager.addProduct("Test Product 1");
        assert.equal(stockManager.addProduct("Test Product 1"),"Product Test Product 1 has already been stored in the system.")
	});


    it('Should return an error on attempt to add more than 3 products on the system', () => {
        stockManager.addProduct("Test Product 2");
        stockManager.addProduct("Test Product 3");
        
        assert.equal(stockManager.addProduct("Test Product 4"),"Maximum number of 3 products reached.")
	});


});

