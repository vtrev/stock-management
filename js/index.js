// JS to interact with the DOM

document.addEventListener('DOMContentLoaded', function () {
  var select = document.querySelectorAll('select');
  M.FormSelect.init(select, {});
  var scrollspy = document.querySelectorAll('.scrollspy');
  M.ScrollSpy.init(scrollspy, {
    scrollOffset: 48
  });

});
// products can be changed at initialisation, ensure the price is a number fixed to 2 decimal places if adding items manually.
// this method of adding stock is optional, the stock items can be empty at init like the last 2 products.
let stockManager = new StockManager({
  "iPhone 8": [{
    "price": Number(4999).toFixed(2),
    "quantity": 12
  }],
  "Galaxy s5": [],
  "One Plus 9": []
});

let addItemsBtn = document.querySelector('#addItemsBtn');
let itemPrice = document.querySelector('#itemPrice');
let itemsReceived = document.querySelector('#itemsReceived');
let addCodeSelector = document.querySelector('#addCodeSelector');
let removeItemsBtn = document.querySelector('#removeItemsBtn');
let customerEmail = document.querySelector('#customerEmail');
let itemsToRemove = document.querySelector('#itemsToRemove');
let removeCodeSelector = document.querySelector('#removeCodeSelector');


let updateStock = function (message) {

  if (message == "addMessage") {
    var res = stockManager.addStockItems(addCodeSelector.value, itemsReceived.value, itemPrice.value);
    document.querySelector('#addStockForm').reset();
  }
  if (message == "removeMessage") {
    var res = stockManager.removeStockItems(removeCodeSelector.value, itemsToRemove.value, customerEmail.value);
    document.querySelector('#removeStockForm').reset();

  }
  let messageBoxElement = document.querySelector(`#${message}Box`);
  var messageBoxTemplateSource = document.querySelector('#messageBoxTemplate').innerHTML;
  var messageBoxTemplate = Handlebars.compile(messageBoxTemplateSource);
  let code = res.startsWith("Error") ? "red" : "green";
  let icon = res.startsWith("Error") ? "report" : "check_circle";

  let params = {
    "code": code,
    "class": message,
    "icon": icon,
    "res": res
  }

  var messageBoxHtml = messageBoxTemplate(params);
  messageBoxElement.innerHTML = messageBoxHtml;

  showLevels();
  setTimeout(() => {
    document.querySelector(`.${message}`).innerHTML = "";
    document.querySelector(`#${message}`).classList.add("hidden");
  }, 6000);
  return false //prevent form from reloading page
}


let showCodes = function () {
  let removeCodeSelectorElement = document.querySelector('#removeCodeSelector');
  let addCodeSelectorElement = document.querySelector('#addCodeSelector');
  var codeSelectorTemplateSource = document.querySelector('#codeSelectorTemplate').innerHTML;
  var codeSelectorTemplate = Handlebars.compile(codeSelectorTemplateSource);
  let productCodes = stockManager.getProductCodes();
  var productCodesHtml = codeSelectorTemplate({
    productCodes
  });
  addCodeSelectorElement.innerHTML = productCodesHtml;
  removeCodeSelectorElement.innerHTML = productCodesHtml;
}
showCodes();

let showLevels = function () {
  var productsElement = document.querySelector('#products');
  var productsTemplateSource = document.querySelector("#stockLevelsTemplate").innerHTML;
  var productsTemplate = Handlebars.compile(productsTemplateSource);
  let products = stockManager.getStockLevels();
  var productsHtml = productsTemplate({
    products
  });
  productsElement.innerHTML = productsHtml;
}
showLevels();