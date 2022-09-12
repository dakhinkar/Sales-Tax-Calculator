
// Taxes Clases
class SaleTax{
    tax = 10;
    additionTax = 15;
    importedTax = 5;
}

class Item extends SaleTax{ 
    constructor(title, price, quantity, isOthers) {
        super();
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.isOthers = Boolean(isOthers);
        this.isImported = this.findIsImported();
        this.newprice = this.getPrice();
        console.log(isOthers);
    }   
    // to find its Product Imported
    findIsImported() {
        let index = this.title.indexOf('imported');
        return index < 0 ? false : true;
    }
    // Get new price including Tax
    getPrice() {
        let price = 0;
        
        if (this.isImported && this.isOthers) { // imported and Other product like Music cd
            price = this.getPriceIncludeTax(this.additionTax);  //   tax = 15
        } else if (this.isImported) {                           // product is Food ,Medical and Book    and its imported
            price = this.getPriceIncludeTax(this.importedTax);  //  tax =5      
        } else if (this.isOthers) {                             // other products
            price = this.getPriceIncludeTax(this.tax);          //  tax = 10
        } else {                                                
            var q = Number(this.quantity);
            var p = Number(this.price);
            price = (q * p);                                    
        }
        
        return price;
    }
    // Return new price
    getPriceIncludeTax(tax) {
        var p = Number(this.price);
        var t = Number(tax);
        var q = Number(this.quantity);
        let newprice = (p*t)/100; 
        newprice = ((newprice + p) * q);
        // newprice = Math.round(newprice, 0.05);
        return (newprice).toFixed(2);
    }
    
}

// Get DOM element
var ul = document.querySelector('ul');
var inputs = document.querySelectorAll('input');

// Get list from Local Storage
let list = JSON.parse(localStorage.getItem('itemList'));

let itemList;
if (list == null) {
    itemList = [];
} else {
    itemList = list;
}
const initialInput = '';

// immediate run after every refresh the window
(function () {
    itemList.forEach((ele) => {
        var li = document.createElement('li');
        li.innerHTML = `<span>${ele.quantity} ${ele.title} : </span> <span>${ele.newprice}</span>`
        ul.appendChild(li);
    })
})();

// clear the UL list / Delete everything from current list
function clearItems() {
    var child = ul.children;
    while (child.length > 0) {  
        child[0].remove();
    }
    while (itemList.length > 0) {
        itemList.pop();
    }
}

// Clear the all input field
function formClearHandler() {  
    inputs.forEach((inputsf) => {
        inputsf.value = '';
    })
    inputs[3].checked = false; // Product type (Food, medical and Book )
   
}

// Adding New List to UL
function formSubmitHandler(event) {
    event.preventDefault();
    var title = inputs[0].value;
    var price = inputs[1].value;
    var quantity = inputs[2].value;
    var isOthers = !inputs[3].checked;
    if (title.length == 0 || price == 0 || quantity == 0) { // Form vlidation by alret the user
        alert('Please provide valid input');
    } else {
        const item = new Item(title, price, quantity,isOthers );
        itemList.push(item);
    
        var li = document.createElement('li');
        li.innerHTML = `<span>${quantity} ${title} : </span> <span>${item.newprice}</span>`
        ul.appendChild(li);
        formClearHandler();                 
        localStorage.setItem('itemList', JSON.stringify(itemList)); // store in Local Storage
    }
    
}

//  Calculate total price
function calculateTotal() {
    var total = itemList.reduce((acc, ele) => {
        return acc + Number(ele.newprice);
    }, 0);
    var totalTax = itemList.reduce((acc, ele) => {
        return acc+ Number(ele.newprice) - Number(ele.price);
    }, 0);
    
    total =total;
    totalTax = (totalTax).toFixed(2);
    const listTotal = document.createElement('li');
    listTotal.innerHTML = `<span> Total :</span> <span>${total}</span>`;
    const listTax = document.createElement('li');
    listTax.innerHTML = `<span> Sales Taxes: </span> <span>${ totalTax }</span>`;
    
    ul.appendChild(listTax);
    ul.appendChild(listTotal);
}