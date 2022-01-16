class StockManager {

    constructor(productsIn) {
        if (Object.keys(productsIn).length !== 3)
            throw new Error('Only 3 Products can be added to the system.')
        this.products = productsIn;
        this.customerEmailAdresses = [];
    };

    addStockItems(productCode, quantity, price) {

        if (this.validateProductCode(productCode)) {
            let quantityInt = parseInt(quantity);

            if (this.validatePrice(price) && this.validateQuantity(quantity)) {
                this.products[`${productCode}`].push({
                    "quantity": Number(`${quantityInt}`),
                    "price": Number(`${price}`)
                });
                return `Added ${quantityInt} items of ${productCode}  @R${price} to the system successfully.`;
            }
            return "Error : Invalid input, please check your quantity and price.";
        }
        return `Error : Please select a valid product code from the drop down.`;
    }

    removeStockItems(productCode, quantity, emailAddress) {

        if (!this.customerEmailAdresses.includes(emailAddress)) {
            
            if (this.validateProductCode(productCode) && this.validateQuantity(quantity)) {
                let quantityToRemove = parseInt(quantity);
                let items = this.products[`${productCode}`].reverse(); //reverse array to get FIFO
                let sumAvailable = 0;
                let j = 1;
                
                for (let i = items.length - 1; i >= 0; i--) {
                    sumAvailable += Number(items[i].quantity);

                    if ((sumAvailable - quantityToRemove) >= 0) {
                        for (let k = 1; k < j + 1; k++) {
                            let quantityAtIndex = items[items.length - k].quantity;
                            if ((quantityAtIndex - quantityToRemove) >= 0) {
                                quantityAtIndex -= quantityToRemove;
                                quantityToRemove -= quantityToRemove;
                                items[items.length - k].quantity = quantityAtIndex;
                                //blacklist email address
                                this.customerEmailAdresses.push(emailAddress)
                                return `${quantity} items of ${productCode} have been removed successfully.`

                            } else {
                                quantityToRemove -= quantityAtIndex
                                quantityAtIndex -= quantityAtIndex
                                items[items.length - k].quantity = quantityAtIndex
                            }
                        }
                    }
                    j++;
                }
                return `Error : Not enough items to remove, you can only remove a maximum of ${sumAvailable} items of ${productCode}.`
            }
            return `Error : Invalid Input, please verify your product code and quantity.`
        }
        return `Error : Email address ${emailAddress} has already been used to purchase on this system.`
    }


    getStockLevels() {

        let stockLevels = {}
        let products = Object.keys(this.products);
        products.forEach((product) => {
            let totalItemQauntity = 0;
            let sumOfItemPrices = 0;
            let productArrayLength = Number(this.products[product].length);

            if (productArrayLength > 0) {
                this.products[product].forEach((item) => {
                    totalItemQauntity += item.quantity;
                    sumOfItemPrices += item.price;
                });

                let averagePrice = (sumOfItemPrices / productArrayLength).toFixed(2);
                stockLevels[product] = {
                    "quantity": totalItemQauntity,
                    "averagePrice": averagePrice,
                    "name": product
                }
            } else {
                stockLevels[product] = {
                    "quantity": "Out of stock",
                    "name": product
                }
            }
        });
        return stockLevels;
    }

    getProductCodes() {
        return Object.keys(this.products);
    }

    //validations

    validateProductCode(productCode) {
        return (Object.keys(this.products).includes(productCode))
    }

    validateQuantity(quantity) {
        return parseInt(quantity) > 0 ? true : false;
    }

    validatePrice(price) {
        return Number(price) > 0 ? true : false;
    }
}