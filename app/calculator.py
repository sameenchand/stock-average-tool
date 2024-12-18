def calculate_average(stocks):
    total_cost = 0
    total_quantity = 0

    for stock in stocks:
        price = stock['price']
        quantity = stock['quantity']
        total_cost += price * quantity
        total_quantity += quantity

    return total_cost / total_quantity if total_quantity > 0 else 0
