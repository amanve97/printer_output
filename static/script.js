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

    if (!receiptDate || items.length === 0) {
        alert('Please fill in all fields and add at least one item.');
        return;
    }

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
        if (data.success) {
            printReceipt();
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function printReceipt() {
    fetch('/print_receipt')
    .then(response => response.text())
    .then(data => {
        console.log(data);
        items = [];
        updateItemList();
        resetPage();
    })
    .catch(error => console.error('Error:', error));
}

function resetPage() {
    document.getElementById('itemForm').reset();
    document.getElementById('receiptForm').reset();
    document.getElementById('addItemButton').style.display = 'inline';
    clearItems();
}

function clearItems() {
    items = [];
    updateItemList();
}
