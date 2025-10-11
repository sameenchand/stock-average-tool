document.addEventListener("DOMContentLoaded", function () {
    // Add a new stock input row
    function addStockInput() {
        const container = document.getElementById('stock-inputs');
        const newRow = document.createElement('div');
        newRow.classList.add('stock-row');
        newRow.innerHTML = `
            <input type="number" name="price" placeholder="Purchase Price ($)" step="0.01" required>
            <input type="number" name="quantity" placeholder="Quantity" required>
            <button type="button" class="delete-row">Delete</button>
        `;
        container.appendChild(newRow);
    }

    // Delete a stock input row
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-row")) {
            event.target.closest('.stock-row').remove();
        }
    });

    // Handle input type switching (for profit/loss calculator)
    function handleInputTypeChange() {
        const priceQuantitySection = document.getElementById('price-quantity-section');
        const percentageInvestmentSection = document.getElementById('percentage-investment-section');
        const radioButtons = document.querySelectorAll('input[name="input_type"]');
        
        if (radioButtons.length > 0) {
            radioButtons.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'price_quantity') {
                        if (priceQuantitySection) priceQuantitySection.style.display = 'block';
                        if (percentageInvestmentSection) percentageInvestmentSection.style.display = 'none';
                    } else if (this.value === 'percentage_investment') {
                        if (priceQuantitySection) priceQuantitySection.style.display = 'none';
                        if (percentageInvestmentSection) percentageInvestmentSection.style.display = 'block';
                    }
                });
            });
        }
    }

    // Real-time calculation preview (optional enhancement)
    function addRealTimeCalculation() {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[type="number"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // This could be enhanced to show real-time calculations
                // For now, we'll just validate inputs
                if (this.value < 0) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#ddd';
                }
            });
        });
    }

    // Form submission debugging
    function addFormDebugging() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                console.log('Form submitted');
                console.log('Form data:', new FormData(form));
                
                // Check if we're on the profit-loss page
                if (window.location.pathname === '/profit-loss') {
                    const inputType = document.querySelector('input[name="input_type"]:checked');
                    console.log('Selected input type:', inputType ? inputType.value : 'none');
                    
                    if (inputType && inputType.value === 'price_quantity') {
                        const buyPrice = document.getElementById('buy_price').value;
                        const quantity = document.getElementById('quantity').value;
                        const currentPrice = document.getElementById('current_price').value;
                        console.log('Price/Quantity values:', { buyPrice, quantity, currentPrice });
                    } else if (inputType && inputType.value === 'percentage_investment') {
                        const investmentAmount = document.getElementById('investment_amount').value;
                        const percentageChange = document.getElementById('percentage_change').value;
                        console.log('Percentage values:', { investmentAmount, percentageChange });
                    }
                }
            });
        }
    }

    // Initialize all functionality
    const addButton = document.getElementById('add-stock-button');
    if (addButton) {
        addButton.addEventListener('click', addStockInput);
    }
    handleInputTypeChange();
    addRealTimeCalculation();
    addFormDebugging();
});
