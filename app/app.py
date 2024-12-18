from flask import Flask, render_template, request
from calculator import calculate_average

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    average_price = None
    total_units = 0
    total_investment = 0
    stocks = []  # To retain user inputs

    if request.method == 'POST':
        prices = request.form.getlist('price')
        quantities = request.form.getlist('quantity')

        # Rebuild the stocks list
        for price, quantity in zip(prices, quantities):
            stocks.append({'price': float(price), 'quantity': int(quantity)})

        # Calculate the average price and total units
        average_price = calculate_average(stocks)
        total_units = sum(stock['quantity'] for stock in stocks)

        # Calculate the total investment
        total_investment = sum(stock['price'] * stock['quantity'] for stock in stocks)

    return render_template('index.html', average_price=average_price, total_units=total_units, total_investment=total_investment, stocks=stocks)

if __name__ == '__main__':
    app.run(debug=True)
