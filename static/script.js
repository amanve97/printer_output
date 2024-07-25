let items = [];

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemQty = document.getElementById('itemQty').value;
    const itemRate = document.getElementById('itemRate').value;
    const receiptNo = document.getElementById('receiptNo').value;
    const officeNo = document.getElementById('officeNo').value;
    const date = document.getElementById('date').value


    if (itemName && itemQty && itemRate ) {
        items.push({
            name: itemName,
            qty: parseInt(itemQty),
            rate: parseFloat(itemRate),
            ReceiptNo: receiptNo,
            OfficeNo: officeNo,
            Date: date

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
        itemElement.innerHTML = `${item.name}:  ${item.qty} x ${item.rate.toFixed(2)} ${item.ReceiptNo}  ${item.date}`;
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
    fetch('/print_receipt', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert(data.message);
            clearItems();
        }
    })
    .catch(error => console.error('Error:', error));
    
}

function clearItems() {
    items = [];
    updateItemList();
}