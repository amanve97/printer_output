
from flask import Flask, request, jsonify, render_template
from datetime import datetime
import win32print
import logging

current_date = datetime.now().date()
current_time = datetime.now().time()
formated_time = current_time.strftime("%H:%M")

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
        print(f"{item['name']}: {item['qty']} x ${item['rate']:.2f}")

    return jsonify({"message": "Items received successfully"})

@app.route('/print_receipt', methods=['GET'])
def print_receipt():
    # Implement printing logic here
    print("Printing receipt...")
    print_receipt_to_printer(items)  # Pass the items to the printing function

    return "Receipt printing initiated"

def print_receipt_to_printer(items):
    PRINTER_NAME = "POS58 printer(2)"
    try:
        hPrinter = win32print.OpenPrinter(PRINTER_NAME)
        hJob = win32print.StartDocPrinter(hPrinter, 1, ("Receipt", None, "RAW"))
        win32print.StartPagePrinter(hPrinter)
            # Example content for the receipt

        receipt_number = items[0]['ReceiptNo']
            
        receipt_content = (
                "-------------------------------\n"
                "        Aditi'S  Corner\n"
                "        Shop no. 316 \n"
                "        Bhoomi Mall\n"
                "        Phone: 9699599602\n"
                "       Thank you for dining!\n"
                "-------------------------------\n"
                "\n"
                f"Date: {current_date}   Time: {formated_time} \n"
                f"Receipt No: {receipt_number}\n"
                "\n"
                "Item       Qty   Rate   Price\n"
                "-------------------------------\n"
            )

            # Add items dynamically
        subtotal = 0
        for item in items:
            price = item['rate'] * item['qty']
            line = f"{item['name'][:12]:<12} {item['qty']:<2} {item['rate']:<4.2f} {price:<3.2f}\n"
            receipt_content += line
            subtotal += price

        total = subtotal

        receipt_content += (
            "-------------------------------\n"
            f"Subtotal              {subtotal:.2f}\n"
            "-------------------------------\n"
            f"Total               Rs {total:.2f}\n"
            "-------------------------------\n"
            "    Thank you for your visit!\n"
            "  Please come again!\n"
            "\n"
            "-------------------------------\n"
        )

            # Send the receipt content to the printer
        win32print.WritePrinter(hPrinter, receipt_content.encode())
        win32print.EndPagePrinter(hPrinter)
        win32print.EndDocPrinter(hPrinter)
    except Exception as e:
        app.logger.error(f"Failed to open printer: {e}")
        print(f"Error during printing: {e}")
    finally:
        if 'hPrinter' in locals():
            win32print.ClosePrinter(hPrinter)

if __name__ == '__main__':
    app.run(debug=True)