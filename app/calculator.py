def calculate_average(stocks):
    total_cost = 0
    total_quantity = 0

    for stock in stocks:
        price = stock['price']
        quantity = stock['quantity']
        total_cost += price * quantity
        total_quantity += quantity

    return total_cost / total_quantity if total_quantity > 0 else 0

def calculate_profit_loss(average_price, current_price, total_quantity):
    """
    Calculate profit/loss based on average price and current price
    """
    total_investment = average_price * total_quantity
    current_value = current_price * total_quantity
    profit_loss = current_value - total_investment
    roi_percentage = (profit_loss / total_investment) * 100 if total_investment > 0 else 0
    
    return {
        'total_investment': total_investment,
        'current_value': current_value,
        'profit_loss': profit_loss,
        'roi_percentage': roi_percentage
    }

def calculate_from_growth_percentage(average_price, growth_percentage, total_quantity):
    """
    Calculate current price and profit/loss from growth percentage
    """
    current_price = average_price * (1 + growth_percentage / 100)
    return calculate_profit_loss(average_price, current_price, total_quantity), current_price

def calculate_profit_loss_simple(buy_price=None, quantity=None, current_price=None, 
                                investment_amount=None, percentage_change=None):
    """
    Simple profit/loss calculator for two scenarios:
    1. buy_price, quantity, current_price
    2. investment_amount, percentage_change
    """
    if buy_price is not None and quantity is not None and current_price is not None:
        # Method 1: Price and quantity
        total_investment = buy_price * quantity
        current_value = current_price * quantity
        profit_loss = current_value - total_investment
        roi_percentage = (profit_loss / total_investment) * 100 if total_investment > 0 else 0
        
        return {
            'method': 'price_quantity',
            'buy_price': buy_price,
            'quantity': quantity,
            'current_price': current_price,
            'total_investment': total_investment,
            'current_value': current_value,
            'profit_loss': profit_loss,
            'roi_percentage': roi_percentage
        }
    
    elif investment_amount is not None and percentage_change is not None:
        # Method 2: Investment amount and percentage change
        profit_loss = investment_amount * (percentage_change / 100)
        current_value = investment_amount + profit_loss
        roi_percentage = percentage_change
        
        return {
            'method': 'percentage_investment',
            'investment_amount': investment_amount,
            'percentage_change': percentage_change,
            'total_investment': investment_amount,
            'current_value': current_value,
            'profit_loss': profit_loss,
            'roi_percentage': roi_percentage
        }
    
    return None