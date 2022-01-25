type productItem = {
    quantity: number,
    price: number
};

class StockManager {

    products: Map < string, Array < productItem >> ;
    customerEmailAdresses: string[];

    constructor(products: Map < string, Array < productItem >> ) {
        if (products.size !== 3)
            throw new Error('Only 3 Products can be added to the system.');

        this.products = products;
        this.customerEmailAdresses = [];
    }

    addStockItems(productCode: string, quantity: number, price: number) {

        if (!this.#validateProductCode(productCode)) {
            return `Error : Please select a valid product code from the drop down.`;
        }

        if (!this.#validatePrice(price)) {
            return "Error : Invalid input, please check your price.";
        }

        if (!this.#validateQuantity(quantity)) {
            return "Error : Invalid input, please check your quantity.";
        }

        let productItemsArray: productItem[] = this.products.get(`${productCode}`);
        let item: productItem = {
            "quantity": quantity,
            "price": price
        }

        productItemsArray.push(item);
        this.products.set(`${productCode}`, productItemsArray);
        return `Added ${quantity} item(s) of ${productCode}  @ R${price} to the system successfully.`;
    }

    removeStockItems(productCode: string, quantity: number, emailAddress: string) {

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

        let quantityToRemove: number = quantity;
        let items: productItem[] = this.products.get(`${productCode}`).reverse(); //reverse array to get FIFO        
        let sumAvailable: number = 0;
        let j: number = 1;

        for (let i = items.length - 1; i >= 0; i--) {
            sumAvailable += items[i].quantity;

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

        let insufficientStockRes = `Error : Not enough item(s) to remove, you can only remove a maximum of ${sumAvailable} item(s) of ${productCode}.`;
        let outOfStockRes = `Error : ${productCode} is out of stock.`;
        return sumAvailable > 0 ? insufficientStockRes : outOfStockRes;

    }

    getStockLevels() {
        let stockLevels = {}
        let products = this.getProductCodes();
        products.forEach((product) => {
            let totalItemQauntity: number = 0;
            let sumOfItemPrices: number = 0;
            let averagePrice: number = 0;

            // exclude zero quantity from average calculation.
            let productArrayWithoutEmptyStock = this.products.get(`${product}`).filter((item: productItem) => item.quantity > 0);
            productArrayWithoutEmptyStock.forEach((item: productItem) => {
                totalItemQauntity += item.quantity;
                sumOfItemPrices += item.price;
            });

            averagePrice = parseFloat((sumOfItemPrices / productArrayWithoutEmptyStock.length).toFixed(2));
            stockLevels[product] = this.#buildStockLevels(totalItemQauntity, averagePrice, product);
        });
        return stockLevels;
    }

    getProductCodes() {
        return Array.from(this.products.keys());
    }

    //helper methods
    #validateProductCode(productCode: string) {
        return this.products.has(`${productCode}`);
    }

    #validateQuantity(quantity: number) {
        return quantity > 0 ? true : false;
    }

    #validatePrice(price: number) {
        return price > 0 ? true : false;
    }

    #buildStockLevels(quantity: number, averagePrice: number, productName: string) {

        let levels = {};
        levels["quantity"] = quantity > 0 ? quantity : "Out of stock";
        if (averagePrice > 0) {
            levels["averagePrice"] = averagePrice.toFixed(2);
        }
        levels["productName"] = productName;
        return levels;
    }

    #checkStockAvailability(number1: number, number2: number) {
        return (number1 - number2 >= 0) ? true : false;
    }


}