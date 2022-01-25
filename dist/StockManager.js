var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StockManager_instances, _StockManager_validateProductCode, _StockManager_validateQuantity, _StockManager_validatePrice, _StockManager_buildStockLevels, _StockManager_checkStockAvailability;
class StockManager {
    constructor(products) {
        _StockManager_instances.add(this);
        if (products.size !== 3)
            throw new Error('Only 3 Products can be added to the system.');
        this.products = products;
        this.customerEmailAdresses = [];
    }
    addStockItems(productCode, quantity, price) {
        if (!__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_validateProductCode).call(this, productCode)) {
            return `Error : Please select a valid product code from the drop down.`;
        }
        if (!__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_validatePrice).call(this, price)) {
            return "Error : Invalid input, please check your price.";
        }
        if (!__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_validateQuantity).call(this, quantity)) {
            return "Error : Invalid input, please check your quantity.";
        }
        let productItemsArray = this.products.get(`${productCode}`);
        let item = {
            "quantity": quantity,
            "price": price
        };
        productItemsArray.push(item);
        this.products.set(`${productCode}`, productItemsArray);
        return `Added ${quantity} item(s) of ${productCode}  @ R${price} to the system successfully.`;
    }
    removeStockItems(productCode, quantity, emailAddress) {
        // validate inputs
        if (this.customerEmailAdresses.includes(emailAddress)) {
            return `Error : Email address ${emailAddress} has already been used to purchase on this system.`;
        }
        if (!__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_validateProductCode).call(this, productCode)) {
            return `Error : Invalid Input, please verify your product code.`;
        }
        if (!__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_validateQuantity).call(this, quantity)) {
            return `Error : Invalid Input, please verify your quantity.`;
        }
        let quantityToRemove = quantity;
        let items = this.products.get(`${productCode}`).reverse(); //reverse array to get FIFO        
        let sumAvailable = 0;
        let j = 1;
        for (let i = items.length - 1; i >= 0; i--) {
            sumAvailable += items[i].quantity;
            if (__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_checkStockAvailability).call(this, sumAvailable, quantityToRemove)) {
                for (let k = 1; k < j + 1; k++) {
                    let quantityAtIndex = items[items.length - k].quantity;
                    if (__classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_checkStockAvailability).call(this, quantityAtIndex, quantityToRemove)) {
                        quantityAtIndex -= quantityToRemove;
                        quantityToRemove -= quantityToRemove;
                        items[items.length - k].quantity = quantityAtIndex;
                        this.customerEmailAdresses.push(emailAddress); //blacklist email address
                        return `${quantity} item(s) of ${productCode} have been removed successfully.`;
                    }
                    else {
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
        let stockLevels = {};
        let products = this.getProductCodes();
        products.forEach((product) => {
            let totalItemQauntity = 0;
            let sumOfItemPrices = 0;
            let averagePrice = 0;
            // exclude zero quantity from average calculation.
            let productArrayWithoutEmptyStock = this.products.get(`${product}`).filter((item) => item.quantity > 0);
            productArrayWithoutEmptyStock.forEach((item) => {
                totalItemQauntity += item.quantity;
                sumOfItemPrices += item.price;
            });
            averagePrice = parseFloat((sumOfItemPrices / productArrayWithoutEmptyStock.length).toFixed(2));
            stockLevels[product] = __classPrivateFieldGet(this, _StockManager_instances, "m", _StockManager_buildStockLevels).call(this, totalItemQauntity, averagePrice, product);
        });
        return stockLevels;
    }
    getProductCodes() {
        return Array.from(this.products.keys());
    }
}
_StockManager_instances = new WeakSet(), _StockManager_validateProductCode = function _StockManager_validateProductCode(productCode) {
    return this.products.has(`${productCode}`);
}, _StockManager_validateQuantity = function _StockManager_validateQuantity(quantity) {
    return quantity > 0 ? true : false;
}, _StockManager_validatePrice = function _StockManager_validatePrice(price) {
    return price > 0 ? true : false;
}, _StockManager_buildStockLevels = function _StockManager_buildStockLevels(quantity, averagePrice, productName) {
    let levels = {};
    levels["quantity"] = quantity > 0 ? quantity : "Out of stock";
    if (averagePrice > 0) {
        levels["averagePrice"] = averagePrice.toFixed(2);
    }
    levels["productName"] = productName;
    return levels;
}, _StockManager_checkStockAvailability = function _StockManager_checkStockAvailability(number1, number2) {
    return (number1 - number2 >= 0) ? true : false;
};
