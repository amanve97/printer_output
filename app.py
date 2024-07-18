from flask import Flask, request, jsonify, render_template

app = Flask(__name__)
items = []  # Global variable to store items

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_items', methods=['POST'])
def submit_items():
    global items
    data = request.json
    items = data['items']
    
    # Print received items data to console
    print("Received Items:")
    for item in items:
        print(f"{item['name']}: {item['qty']} x ${item['price']:.2f}")

    return jsonify({"message": "Items received successfully"})

@app.route('/print_receipt', methods=['GET'])
def print_receipt():
    # Implement printing logic here
    print("Printing receipt...")
    print_receipt_to_printer(items)  # Pass the items to the printing function

    return "Receipt printing initiated"

def print_receipt_to_printer(items):
    import win32print
    import win32ui

    PRINTER_NAME = "POS58 printer(2)"

    hPrinter = win32print.OpenPrinter(PRINTER_NAME)
    try:
        hJob = win32print.StartDocPrinter(hPrinter, 1, ("Receipt", None, "RAW"))
        try:
            win32print.StartPagePrinter(hPrinter)
            
            # Example content for the receipt
            receipt_content = (
                "-------------------------------\n"
                "        Aditi'S  Corner\n"
                "        Shop no. 316 \n"
                "        Bhoomi Mall\n"
                "        Phone: 9699599602\n"
                "       Thank you for dining!\n"
                "-------------------------------\n"
                "\n"
                "Date: yyyy-mm-dd   Time: hh:mm\n"
                "Receipt No: xxxxxx\n"
                "\n"
                "Item           Qty    Price\n"
                "-------------------------------\n"
            )

            # Add items dynamically
            for item in items:
                receipt_content += f"{item['name'][:15]:<15} {item['qty']:<5} {item['price']:<6.2f}\n"

            receipt_content += (
                "-------------------------------\n"
                "Subtotal              1555.00\n"
                "Tax (5%)              2.95\n"
                "-------------------------------\n"
                "Total                2252.95\n"
                "-------------------------------\n"
                "    Thank you for your visit!\n"
                "  Please come again!\n"
                "\n"
                "-------------------------------\n"
            )

            # Send the receipt content to the printer
            win32print.WritePrinter(hPrinter, receipt_content.encode())
            
            win32print.EndPagePrinter(hPrinter)
        finally:
            win32print.EndDocPrinter(hPrinter)
    finally:
        win32print.ClosePrinter(hPrinter)

if __name__ == '__main__':
    app.run(debug=True)
