from flask import Flask, render_template, request
from calculator import calculate_average, calculate_profit_loss_simple

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
            if price and quantity:  # Only add if both fields have values
                stocks.append({'price': float(price), 'quantity': int(quantity)})

        if stocks:  # Only calculate if we have stock data
            # Calculate the average price and total units
            average_price = calculate_average(stocks)
            total_units = sum(stock['quantity'] for stock in stocks)
            # Calculate the total investment
            total_investment = sum(stock['price'] * stock['quantity'] for stock in stocks)

    return render_template('index.html', 
                         average_price=average_price, 
                         total_units=total_units, 
                         total_investment=total_investment, 
                         stocks=stocks)

@app.route('/profit-loss', methods=['GET', 'POST'])
def profit_loss():
    result = None
    input_type = 'price_quantity'  # Default to price/quantity input

    if request.method == 'POST':
        input_type = request.form.get('input_type', 'price_quantity')
        
        if input_type == 'price_quantity':
            # Method 1: Price and quantity
            buy_price = request.form.get('buy_price')
            quantity = request.form.get('quantity')
            current_price = request.form.get('current_price')
            
            if buy_price and quantity and current_price:
                result = calculate_profit_loss_simple(
                    buy_price=float(buy_price), 
                    quantity=int(quantity), 
                    current_price=float(current_price)
                )
        
        elif input_type == 'percentage_investment':
            # Method 2: Percentage change and investment amount
            investment_amount = request.form.get('investment_amount')
            percentage_change = request.form.get('percentage_change')
            
            if investment_amount and percentage_change:
                result = calculate_profit_loss_simple(
                    investment_amount=float(investment_amount),
                    percentage_change=float(percentage_change)
                )

    return render_template('profit_loss.html', result=result, input_type=input_type)

if __name__ == '__main__':
    app.run(debug=True)
