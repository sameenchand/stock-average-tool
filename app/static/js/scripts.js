document.addEventListener("DOMContentLoaded", function () {

    // ── Shared helpers ───────────────────────────────────────────────────────

    function fmt(n) {
        return '$' + n.toFixed(2);
    }

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    // Block negative values on any number input with min="0"
    document.addEventListener('input', function (e) {
        const input = e.target;
        if (input.type === 'number' && input.min === '0' && input.value !== '' && parseFloat(input.value) < 0) {
            input.value = 0;
        }
    });

    // ── Average Calculator ───────────────────────────────────────────────────

    const stockInputs = document.getElementById('stock-inputs');

    if (stockInputs) {

        function calculateAverage() {
            const rows = stockInputs.querySelectorAll('.stock-row');
            let totalCost = 0;
            let totalQuantity = 0;

            rows.forEach(function (row) {
                const price = parseFloat(row.querySelector('input[name="price"]').value);
                const qty   = parseFloat(row.querySelector('input[name="quantity"]').value);
                if (price > 0 && qty > 0) {
                    totalCost     += price * qty;
                    totalQuantity += qty;
                }
            });

            const resultSection = document.getElementById('result-section');
            if (totalQuantity > 0) {
                const avg = totalCost / totalQuantity;

                document.getElementById('result-avg-price').textContent      = fmt(avg);
                document.getElementById('result-total-units').textContent     = totalQuantity;
                document.getElementById('result-total-investment').textContent = fmt(totalCost);

                // Pre-fill the profit/loss page via query param
                const plLink = document.getElementById('pl-link');
                plLink.href = '/profit-loss?buy_price=' + avg.toFixed(2) + '&quantity=' + totalQuantity;

                resultSection.style.display = 'block';
            } else {
                resultSection.style.display = 'none';
            }
        }

        // Recalculate whenever any input inside stock-inputs changes
        stockInputs.addEventListener('input', calculateAverage);

        // Add a new stock row
        function addStockRow() {
            const row = document.createElement('div');
            row.classList.add('stock-row');
            row.innerHTML = `
                <input type="number" name="price"    placeholder="Enter Price ($)" step="0.01" min="0">
                <input type="number" name="quantity" placeholder="Enter Quantity"            min="0">
                <button type="button" class="delete-row">Delete</button>
            `;
            stockInputs.appendChild(row);
            // Bind input events on the new row
            row.addEventListener('input', calculateAverage);
        }

        // Delete a stock row (event delegation)
        stockInputs.addEventListener('click', function (e) {
            if (e.target.classList.contains('delete-row')) {
                const allRows = stockInputs.querySelectorAll('.stock-row');
                if (allRows.length > 1) {
                    e.target.closest('.stock-row').remove();
                    calculateAverage();
                }
            }
        });

        const addBtn = document.getElementById('add-stock-button');
        if (addBtn) addBtn.addEventListener('click', addStockRow);

        const clearBtn = document.getElementById('clear-all-button');
        if (clearBtn) clearBtn.addEventListener('click', function () {
            const rows = stockInputs.querySelectorAll('.stock-row');
            rows.forEach(function (row, i) {
                if (i === 0) {
                    row.querySelector('input[name="price"]').value = '';
                    row.querySelector('input[name="quantity"]').value = '';
                } else {
                    row.remove();
                }
            });
            calculateAverage();
        });
    }

    // ── Profit/Loss Calculator ───────────────────────────────────────────────

    const pqSection  = document.getElementById('price-quantity-section');
    const pctSection = document.getElementById('percentage-investment-section');

    if (pqSection || pctSection) {

        // Read query params set by the average calculator link
        const params = new URLSearchParams(window.location.search);
        const prefillPrice = params.get('buy_price');
        const prefillQty   = params.get('quantity');
        if (prefillPrice) {
            const el = document.getElementById('buy_price');
            if (el) el.value = prefillPrice;
        }
        if (prefillQty) {
            const el = document.getElementById('quantity');
            if (el) el.value = prefillQty;
        }

        function updatePLDisplay(profitLoss, roi, summaryId) {
            // Show the right summary block
            document.getElementById('pq-summary').style.display  = summaryId === 'pq-summary'  ? '' : 'none';
            document.getElementById('pct-summary').style.display = summaryId === 'pct-summary' ? '' : 'none';

            const plItem  = document.getElementById('res-pl-item');
            const roiItem = document.getElementById('res-roi-item');
            const fill    = document.getElementById('res-progress-fill');

            document.getElementById('res-net-pl').textContent = fmt(profitLoss);
            document.getElementById('res-roi').textContent    = roi.toFixed(2) + '%';

            const isProfit = profitLoss >= 0;
            plItem.className  = 'profit-loss-item ' + (isProfit ? 'profit' : 'loss');
            roiItem.className = 'profit-loss-item ' + (isProfit ? 'profit' : 'loss');
            fill.className    = 'progress-fill '    + (isProfit ? 'profit' : 'loss');

            // Map roi from [-100, +100] → bar width [0%, 100%], capped at both ends
            const barWidth = clamp((roi + 100) / 2, 0, 100);
            fill.style.width = barWidth + '%';

            document.getElementById('result-section').style.display = 'block';
        }

        function calculatePL() {
            const method = document.querySelector('input[name="input_type"]:checked')?.value;

            if (method === 'price_quantity' || !method) {
                const buyPrice     = parseFloat(document.getElementById('buy_price')?.value);
                const qty          = parseFloat(document.getElementById('quantity')?.value);
                const currentPrice = parseFloat(document.getElementById('current_price')?.value);

                if (buyPrice > 0 && qty > 0 && currentPrice > 0) {
                    const totalInv   = buyPrice * qty;
                    const curVal     = currentPrice * qty;
                    const pl         = curVal - totalInv;
                    const roi        = (pl / totalInv) * 100;

                    document.getElementById('res-buy-price').textContent        = fmt(buyPrice);
                    document.getElementById('res-quantity').textContent         = qty;
                    document.getElementById('res-current-price').textContent    = fmt(currentPrice);
                    document.getElementById('res-total-investment').textContent = fmt(totalInv);
                    document.getElementById('res-current-value').textContent    = fmt(curVal);

                    updatePLDisplay(pl, roi, 'pq-summary');
                } else {
                    document.getElementById('result-section').style.display = 'none';
                }

            } else if (method === 'percentage_investment') {
                const invAmount = parseFloat(document.getElementById('investment_amount')?.value);
                const pctChange = parseFloat(document.getElementById('percentage_change')?.value);

                if (invAmount > 0 && !isNaN(pctChange)) {
                    const pl     = invAmount * (pctChange / 100);
                    const curVal = invAmount + pl;
                    const roi    = pctChange;

                    document.getElementById('res-investment-amount').textContent  = fmt(invAmount);
                    document.getElementById('res-pct-change').textContent         = pctChange.toFixed(2) + '%';
                    document.getElementById('res-pct-current-value').textContent  = fmt(curVal);

                    updatePLDisplay(pl, roi, 'pct-summary');
                } else {
                    document.getElementById('result-section').style.display = 'none';
                }
            }
        }

        // Switch visible input section when radio changes
        document.querySelectorAll('input[name="input_type"]').forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (this.value === 'price_quantity') {
                    pqSection.style.display  = '';
                    pctSection.style.display = 'none';
                } else {
                    pqSection.style.display  = 'none';
                    pctSection.style.display = '';
                }
                calculatePL();
            });
        });

        // Recalculate on any input change in the profit/loss section
        document.querySelectorAll('#price-quantity-section input, #percentage-investment-section input').forEach(function (input) {
            input.addEventListener('input', calculatePL);
        });

        // Run once on load in case inputs were pre-filled via query params
        if (prefillPrice || prefillQty) calculatePL();
    }

});
