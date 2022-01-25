// JS to interact with the DOM

document.addEventListener('DOMContentLoaded', function () {
  var select = document.querySelectorAll('select');
  M.FormSelect.init(select, {});
  var scrollspy = document.querySelectorAll('.scrollspy');
  M.ScrollSpy.init(scrollspy, {
    scrollOffset: 48
  });

});

let productMap = new Map(); // products can be changed at initialisation, this method of adding stock is optional, items array can be empty.

productMap.set("iPhone 8", [{
  "price": 5000,
  "quantity": 12
}]);
productMap.set("Galaxy s5", []);
productMap.set("One Plus 9", []);

let stockManager = new StockManager(productMap);

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
    var res = stockManager.addStockItems(addCodeSelector.value, Number(itemsReceived.value), Number(itemPrice.value));
    document.querySelector('#addStockForm').reset();
  }
  if (message == "removeMessage") {
    var res = stockManager.removeStockItems(removeCodeSelector.value, Number(itemsToRemove.value), customerEmail.value);
    document.querySelector('#removeStockForm').reset();

  }
  let messageBoxElement = document.querySelector(`#${message}Box`);
  let messageBoxTemplateSource = document.querySelector('#messageBoxTemplate').innerHTML;
  let messageBoxTemplate = Handlebars.compile(messageBoxTemplateSource);
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
    document.querySelector(`#${message}`).classList.add("hidden");
  }, 6000);
  return false //prevent form from reloading page
}


let showCodes = function () {
  let removeCodeSelectorElement = document.querySelector('#removeCodeSelector');
  let addCodeSelectorElement = document.querySelector('#addCodeSelector');
  let codeSelectorTemplateSource = document.querySelector('#codeSelectorTemplate').innerHTML;
  let codeSelectorTemplate = Handlebars.compile(codeSelectorTemplateSource);
  let productCodes = stockManager.getProductCodes();
  let productCodesHtml = codeSelectorTemplate({
    productCodes
  });
  addCodeSelectorElement.innerHTML = productCodesHtml;
  removeCodeSelectorElement.innerHTML = productCodesHtml;
}
showCodes();

let showLevels = function () {
  let productsElement = document.querySelector('#products');
  let stockLevelsTemplateSource = document.querySelector("#stockLevelsTemplate").innerHTML;
  let stockLevelsTemplate = Handlebars.compile(stockLevelsTemplateSource);
  let products = stockManager.getStockLevels();
  let productsHtml = stockLevelsTemplate({
    products
  });
  productsElement.innerHTML = productsHtml;
}
showLevels();