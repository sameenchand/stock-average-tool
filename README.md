# Stock Average Price Calculator & Profit/Loss Tracker

A comprehensive Flask web application for calculating weighted average stock prices and tracking profit/loss with an intuitive, modern interface.

## 🚀 Features

### **Average Price Calculator**
- **Dynamic Input Management**: Add/remove stock entries on the fly
- **Column Headers**: Clear "Price ($)" and "Quantity" column indicators
- **Real-time Validation**: Input validation with visual feedback
- **Form Persistence**: Values stay in form after calculation for easy editing
- **Responsive Design**: Works perfectly on desktop and mobile devices

### **Profit/Loss Calculator**
- **Dual Calculation Methods**:
  - **Price & Quantity**: Enter buy price, quantity, and current price
  - **Percentage & Investment**: Enter investment amount and percentage change
- **Comprehensive Results**:
  - Total investment and current value
  - Net profit/loss with color coding (green for profit, red for loss)
  - ROI percentage with visual progress bar
  - Detailed summary grid layout

### **User Experience**
- **Modern UI**: Clean, professional design with blue color scheme
- **Visual Indicators**: Color-coded results and progress bars
- **Form State Management**: Inputs persist after calculations
- **Mobile Responsive**: Optimized for all screen sizes
- **Intuitive Navigation**: Clear navigation between calculators

## 🛠️ Tech Stack

- **Backend**: Python 3.9+ with Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design principles
- **Architecture**: MVC pattern with separation of concerns

## 📁 Project Structure

```
stock-average-tool/
├── app/
│   ├── app.py                 # Flask application and routing
│   ├── calculator.py          # Business logic for calculations
│   ├── templates/
│   │   ├── index.html         # Average calculator interface
│   │   └── profit_loss.html   # Profit/loss calculator interface
│   └── static/
│       ├── css/
│       │   └── styles.css     # Modern styling and responsive design
│       └── js/
│           └── scripts.js     # Dynamic form handling and validation
├── requirements.txt           # Python dependencies
└── README.md                 # This documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- pip (Python package installer)

### Installation

1. **Clone or download** the project to your local machine

2. **Navigate to the project directory**:
   ```bash
   cd stock-average-tool
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app/app.py
   ```

5. **Open your browser** and go to:
   ```
   http://127.0.0.1:5000
   ```

## 📊 How It Works

### **Average Price Calculator**
1. **Add Stock Entries**: Click "+ Add Stock" to add new price/quantity rows
2. **Enter Data**: Input purchase price and quantity for each stock lot
3. **Calculate**: Click "Calculate" to get weighted average price
4. **View Results**: See average price, total units, and total investment

**Formula**: `Average Price = Total Investment ÷ Total Quantity`

### **Profit/Loss Calculator**

#### **Method 1: Price & Quantity**
1. Enter buy price, quantity, and current price
2. Get detailed profit/loss analysis with ROI

#### **Method 2: Percentage & Investment**
1. Enter investment amount and percentage change
2. Calculate profit/loss based on percentage

**Formulas**:
- `Total Investment = Buy Price × Quantity`
- `Current Value = Current Price × Quantity`
- `Net Profit/Loss = Current Value - Total Investment`
- `ROI = (Profit/Loss ÷ Total Investment) × 100`

## 💡 Example Calculations

### **Average Price Example**
If you buy:
- 10 shares at $50.00
- 20 shares at $60.00
- 15 shares at $55.00

**Results**:
- Total Investment: $2,225.00
- Total Quantity: 45 shares
- **Average Price: $49.44**

### **Profit/Loss Example**
Using the average price above:
- Current Price: $65.00
- Current Value: 45 × $65.00 = $2,925.00
- **Net Profit: $700.00**
- **ROI: 31.46%**

## 🎨 Key Features

### **Modern Interface**
- Clean, professional design
- Color-coded results (green for profit, red for loss)
- Responsive layout for all devices
- Intuitive navigation between calculators

### **Smart Form Handling**
- Dynamic add/remove functionality
- Input validation and error handling
- Form state persistence after calculations
- Real-time visual feedback

### **Comprehensive Calculations**
- Weighted average price calculation
- Multiple profit/loss calculation methods
- ROI percentage with visual indicators
- Detailed summary displays

## 🔧 Technical Details

### **Backend (Flask)**
- **Routes**: `/` (average calculator), `/profit-loss` (profit/loss calculator)
- **Methods**: GET (display forms), POST (process calculations)
- **Data Handling**: Form data processing and validation
- **Templates**: Jinja2 templating with dynamic content

### **Frontend (JavaScript)**
- **Dynamic Forms**: Add/remove input rows
- **Input Validation**: Real-time validation with visual feedback
- **Form State**: Maintains input values after calculations
- **Responsive Design**: Mobile-optimized interactions

### **Styling (CSS)**
- **Modern Design**: Clean, professional appearance
- **Responsive Layout**: Works on all screen sizes
- **Color Coding**: Visual indicators for profit/loss
- **Animations**: Smooth transitions and hover effects

## 🚀 Future Enhancements

Potential features for future development:
- Dark mode toggle
- Data export (CSV, PDF)
- Portfolio saving/loading
- Real-time stock price integration
- Advanced charting and visualization
- Mobile app version
- Multi-currency support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For questions or support, please open an issue in the project repository.

---

**Happy Trading! 📈**