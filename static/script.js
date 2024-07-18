let items = [];

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemQty = document.getElementById('itemQty').value;
    const itemPrice = document.getElementById('itemPrice').value;

    if (itemName && itemQty && itemPrice) {
        items.push({
            name: itemName,
            qty: parseInt(itemQty),
            price: parseFloat(itemPrice)
        });

        updateItemList();
        clearForm();
    } else {
        alert('Please fill in all fields.');
    }
}

function updateItemList() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `${item.name}: ${item.qty} x $${item.price.toFixed(2)}`;
        itemList.appendChild(itemElement);
    });
}

function clearForm() {
    document.getElementById('itemForm').reset();
}

function submitItems() {
    fetch('/submit_items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        printReceipt();
    })
    .catch(error => console.error('Error:', error));
}

function printReceipt() {
    fetch('/print_receipt')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
