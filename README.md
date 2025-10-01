## Stock Average Price Calculator

A simple Flask web app to calculate the weighted average purchase price of stocks. Enter multiple lots with price and quantity, add or delete rows dynamically, and see:

- Average price per stock
- Total units
- Total investment

### Tech Stack
- Python (Flask)
- HTML, CSS, JavaScript

### Project Structure
```
average_calculator/
  app/
    app.py              # Flask app entrypoint
    calculator.py       # Average calculation logic
    templates/
      index.html        # UI template
    static/
      css/styles.css    # Styles
      js/scripts.js     # Client-side interactivity
  requirements.txt      # Python dependencies
  README.md             # This file
```

### Prerequisites
- Python 3.9+ installed

### How It Works
- The form lets you add multiple stock entries (price and quantity)
- Client-side JavaScript lets you add/remove rows quickly
- On submit, the server calculates:
  - Weighted average price: sum(price × qty) ÷ sum(qty)
  - Total units and total investment
- Inputs persist in the form after calculation for easy editing

### Key Files
- `app/app.py`: Flask route handling and orchestration
- `app/calculator.py`: `calculate_average(stocks)` computes the weighted average
- `app/templates/index.html`: Form and results rendering

### Example
If you buy:
- 10 units at $5.00
- 20 units at $7.00

Average price = (10×5 + 20×7) ÷ (10+20) = 6.33
