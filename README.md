# Stock Calculator

I do stock market and am kind of obsessed with it. But when searching for calculators online, nothing reliable met my expectations — so I built one for myself.

Live: https://stock-average-calculator-5mgs.onrender.com

---

## What it does

**Average Price Calculator**
Calculate the weighted average price across multiple buy lots.

**Profit/Loss Calculator**
Enter your buy price and current price, or an investment amount and percentage change, to see your net profit/loss and ROI. Includes a target price tool — enter a desired ROI and see exactly what price the stock needs to reach.

**DCA Calculator**
Enter your current position and a new buy price to find out how many shares you need to purchase to reach a target average price.

---

## Stack

Python, Flask, HTML, CSS, JavaScript — hosted on Render.

---

## Run locally

```bash
git clone https://github.com/sameenchand/stock-average-tool.git
cd stock-average-tool
pip install -r requirements.txt
python app/app.py
```

Open http://127.0.0.1:5000
