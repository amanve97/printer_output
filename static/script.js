let items = [];

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemQty = document.getElementById('itemQty').value;
    const itemRate = document.getElementById('itemRate').value;

    if (itemName && itemQty && itemRate) {
        items.push({
            name: itemName,
            qty: parseInt(itemQty),
            rate: parseFloat(itemRate)
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
        itemElement.innerHTML = `${item.name}: ${item.qty} x ${item.rate.toFixed(2)}`;
        itemList.appendChild(itemElement);
    });
}

function clearForm() {
    document.getElementById('itemForm').reset();
}

function submitItems() {
    const receiptDate = document.getElementById('receiptDate').value;
    const receiptNo = document.getElementById('receiptNo').value;

    fetch('/submit_items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            items,
            date: receiptDate,
            receiptNo: receiptNo 
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        printReceipt();
        // Hide the Add Item button
        document.getElementById('addItemButton').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function printReceipt() {
    fetch('/print_receipt')
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Clear the items and update the list
        items = [];
        updateItemList();
    })
    .catch(error => console.error('Error:', error));
}

function clearItems() {
    items = [];
    updateItemList();
}
