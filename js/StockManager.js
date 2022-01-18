class StockManager {

    constructor(productsIn) {
        if (Object.keys(productsIn).length !== 3)
            throw new Error('Only 3 Products can be added to the system.');
        this.products = productsIn;
        this.customerEmailAdresses = [];
    };

    addStockItems(productCode, quantity, price) {

        if (!this.#validateProductCode(productCode)) {
            return `Error : Please select a valid product code from the drop down.`;
        }

        if (!this.#validatePrice(price)) {
            return "Error : Invalid input, please check your price.";
        }

        if (!this.#validateQuantity(quantity)) {
            return "Error : Invalid input, please check your quantity.";
        }

        let quantityInt = parseInt(quantity);

        this.products[`${productCode}`].push({
            "quantity": Number(`${quantityInt}`),
            "price": parseFloat(`${price}`).toFixed(2)
        });
        return `Added ${quantityInt} item(s) of ${productCode}  @R ${price} to the system successfully.`;
    }


    removeStockItems(productCode, quantity, emailAddress) {

    // validate inputs
    if (this.customerEmailAdresses.includes(emailAddress)) {
        return `Error : Email address ${emailAddress} has already been used to purchase on this system.`;
    }

    if (!this.#validateProductCode(productCode)) {
        return `Error : Invalid Input, please verify your product code.`;
    }

    if (!this.#validateQuantity(quantity)) {
        return `Error : Invalid Input, please verify your quantity.`;
    }

    let quantityToRemove = parseInt(quantity);
    let items = this.products[`${productCode}`].reverse(); //reverse array to get FIFO
    let sumAvailable = 0;
    let j = 1;

    for (let i = items.length - 1; i >= 0; i--) {
        sumAvailable += Number(items[i].quantity);

        if (this.#checkStockAvailability(sumAvailable, quantityToRemove)) {
            for (let k = 1; k < j + 1; k++) {
                let quantityAtIndex = items[items.length - k].quantity;
                if (this.#checkStockAvailability(quantityAtIndex, quantityToRemove)) {
                    quantityAtIndex -= quantityToRemove;
                    quantityToRemove -= quantityToRemove;
                    items[items.length - k].quantity = quantityAtIndex;
                    this.customerEmailAdresses.push(emailAddress); //blacklist email address
                    return `${quantity} item(s) of ${productCode} have been removed successfully.`;
                } else {
                    quantityToRemove -= quantityAtIndex;
                    items[items.length - k].quantity = 0; // deplete available quantity
                }
            }
        }
        j++;
    }

    let insufficientStockRes =  `Error : Not enough item(s) to remove, you can only remove a maximum of ${sumAvailable} item(s) of ${productCode}.`;
    let outOfStockRes = `Error : ${productCode} is out of stock.`;
    return sumAvailable > 0 ? insufficientStockRes : outOfStockRes;

    }

    getStockLevels() {

        let stockLevels = {}
        let products = Object.keys(this.products);
        products.forEach((product) => {
            let totalItemQauntity = 0;
            let sumOfItemPrices = 0.00;
            let averagePrice = 0;

            // exclude zero quantity for average calculation, items out of stock left in products can be used for history.
            let productArrayWithoutEmptyStock = this.products[`${product}`].filter((item) => Number(item.quantity) > 0);
            productArrayWithoutEmptyStock.forEach((item) => {
                totalItemQauntity += Number(item.quantity);
                sumOfItemPrices += Number(item.price);
            });

            averagePrice = parseFloat(sumOfItemPrices / productArrayWithoutEmptyStock.length).toFixed(2);
            stockLevels[product] = this.#buildStockLevels(totalItemQauntity, averagePrice, product);
        });
        return stockLevels;
    }


    getProductCodes() {
        return Object.keys(this.products);
    }

    //helper methods
    #validateProductCode(productCode) {
        return (Object.keys(this.products).includes(productCode));
    }

    #validateQuantity(quantity) {
        return parseInt(quantity) > 0 ? true : false;
    }

    #validatePrice(price) {
        return Number(price) > 0 ? true : false;
    }

    #buildStockLevels(quantity, averagePrice, productName) {
        let productStockLevels = {};
        productStockLevels["quantity"] = quantity > 0 ? quantity : "Out of stock";
        if (averagePrice > 0) {
            productStockLevels["averagePrice"] = averagePrice;
        }
        productStockLevels["name"] = productName;
        return productStockLevels;
    }

    #checkStockAvailability(number1, number2) {
        return (number1 - number2 >= 0) ? true : false;
    }

}