document.addEventListener("DOMContentLoaded", function () {

    // ── Shared helpers ───────────────────────────────────────────────────────

    function fmt(n) {
        return n.toFixed(2);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    }

    function showCopyFeedback(btn) {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.disabled = true;
        setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
        }, 2000);
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

        function saveAvgState() {
            const rows = stockInputs.querySelectorAll('.stock-row');
            const data = [];
            rows.forEach(function (row) {
                data.push({
                    price:    row.querySelector('input[name="price"]').value,
                    quantity: row.querySelector('input[name="quantity"]').value
                });
            });
            localStorage.setItem('avgCalc_rows', JSON.stringify(data));
        }

        function restoreAvgState() {
            const saved = localStorage.getItem('avgCalc_rows');
            if (!saved) return;
            try {
                const data = JSON.parse(saved);
                if (!Array.isArray(data) || data.length === 0) return;
                const existing = stockInputs.querySelectorAll('.stock-row');
                existing.forEach(function (r) { r.remove(); });
                data.forEach(function (item) {
                    addStockRow(item.price, item.quantity);
                });
            } catch (e) { /* ignore corrupt data */ }
        }

        function calculateAverage() {
            saveAvgState();

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

        // Add a new stock row (optionally pre-filled)
        function addStockRow(price, quantity) {
            const row = document.createElement('div');
            row.classList.add('stock-row');
            row.innerHTML = `
                <input type="number" name="price"    placeholder="Enter Price" step="0.01" min="0" value="${price || ''}">
                <input type="number" name="quantity" placeholder="Enter Quantity"            min="0" value="${quantity || ''}">
                <button type="button" class="delete-row">Delete</button>
            `;
            stockInputs.appendChild(row);
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
        if (addBtn) addBtn.addEventListener('click', function () { addStockRow('', ''); });

        const avgCopyBtn = document.getElementById('avg-copy-btn');
        if (avgCopyBtn) avgCopyBtn.addEventListener('click', function () {
            const avg  = document.getElementById('result-avg-price').textContent;
            const units = document.getElementById('result-total-units').textContent;
            const inv  = document.getElementById('result-total-investment').textContent;
            copyToClipboard(
                'Stock Average Calculator Results\n' +
                'Average Price: ' + avg + '\n' +
                'Total Units: '   + units + '\n' +
                'Total Investment: ' + inv
            );
            showCopyFeedback(avgCopyBtn);
        });

        // Restore saved state on load, then calculate
        restoreAvgState();
        calculateAverage();

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

        function savePLState() {
            const method = document.querySelector('input[name="input_type"]:checked')?.value || 'price_quantity';
            localStorage.setItem('plCalc_method', method);
            localStorage.setItem('plCalc_pq', JSON.stringify({
                buy_price:     document.getElementById('buy_price')?.value     || '',
                quantity:      document.getElementById('quantity')?.value      || '',
                current_price: document.getElementById('current_price')?.value || ''
            }));
            localStorage.setItem('plCalc_pct', JSON.stringify({
                investment_amount: document.getElementById('investment_amount')?.value || '',
                percentage_change: document.getElementById('percentage_change')?.value || ''
            }));
        }

        function restorePLState() {
            const method = localStorage.getItem('plCalc_method');
            if (method) {
                const radio = document.querySelector(`input[name="input_type"][value="${method}"]`);
                if (radio) {
                    radio.checked = true;
                    pqSection.style.display  = method === 'price_quantity' ? '' : 'none';
                    pctSection.style.display = method === 'percentage_investment' ? '' : 'none';
                }
            }
            try {
                const pq = JSON.parse(localStorage.getItem('plCalc_pq') || '{}');
                if (pq.buy_price)     document.getElementById('buy_price').value     = pq.buy_price;
                if (pq.quantity)      document.getElementById('quantity').value      = pq.quantity;
                if (pq.current_price) document.getElementById('current_price').value = pq.current_price;
                const pct = JSON.parse(localStorage.getItem('plCalc_pct') || '{}');
                if (pct.investment_amount) document.getElementById('investment_amount').value = pct.investment_amount;
                if (pct.percentage_change) document.getElementById('percentage_change').value = pct.percentage_change;
            } catch (e) { /* ignore */ }
        }

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

        function updateTargetPrice() {
            const buyPrice  = parseFloat(document.getElementById('buy_price')?.value);
            const targetRoi = parseFloat(document.getElementById('target-roi')?.value);
            const resultEl  = document.getElementById('target-price-result');
            if (!resultEl) return;
            if (buyPrice > 0 && !isNaN(targetRoi)) {
                resultEl.textContent = fmt(buyPrice * (1 + targetRoi / 100));
            } else {
                resultEl.textContent = '—';
            }
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

            // Target price card only makes sense for Method 1
            const targetCard = document.getElementById('target-price-section');
            if (targetCard) targetCard.style.display = summaryId === 'pq-summary' ? 'block' : 'none';

            document.getElementById('result-section').style.display = 'block';
        }

        function calculatePL() {
            savePLState();
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

        // Target ROI input — recalculate target price live
        const targetRoiInput = document.getElementById('target-roi');
        if (targetRoiInput) targetRoiInput.addEventListener('input', updateTargetPrice);
        document.getElementById('buy_price')?.addEventListener('input', updateTargetPrice);

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

        const plCopyBtn = document.getElementById('pl-copy-btn');
        if (plCopyBtn) plCopyBtn.addEventListener('click', function () {
            const method = document.querySelector('input[name="input_type"]:checked')?.value;
            let text = 'Profit/Loss Calculator Results\n';
            if (method === 'price_quantity' || !method) {
                text += 'Buy Price: '         + document.getElementById('res-buy-price').textContent        + '\n';
                text += 'Quantity: '          + document.getElementById('res-quantity').textContent         + '\n';
                text += 'Current Price: '     + document.getElementById('res-current-price').textContent    + '\n';
                text += 'Total Investment: '  + document.getElementById('res-total-investment').textContent + '\n';
                text += 'Current Value: '     + document.getElementById('res-current-value').textContent    + '\n';
            } else {
                text += 'Investment: '        + document.getElementById('res-investment-amount').textContent  + '\n';
                text += 'Change: '            + document.getElementById('res-pct-change').textContent         + '\n';
                text += 'Current Value: '     + document.getElementById('res-pct-current-value').textContent + '\n';
            }
            text += 'Net P/L: ' + document.getElementById('res-net-pl').textContent + '\n';
            text += 'ROI: '     + document.getElementById('res-roi').textContent;
            copyToClipboard(text);
            showCopyFeedback(plCopyBtn);
        });

        // Restore saved state (only when no URL params present), then calculate
        if (!prefillPrice && !prefillQty) restorePLState();
        calculatePL();
    }

    // ── DCA Calculator ───────────────────────────────────────────────────────

    const dcaInputs = document.getElementById('dca-inputs');

    if (dcaInputs) {

        function calculateDCA() {
            const currentQty = parseFloat(document.getElementById('dca-current-qty').value);
            const currentAvg = parseFloat(document.getElementById('dca-current-avg').value);
            const newPrice   = parseFloat(document.getElementById('dca-new-price').value);
            const targetAvg  = parseFloat(document.getElementById('dca-target-avg').value);

            const resultSection  = document.getElementById('dca-result');
            const errorDiv       = document.getElementById('dca-error');
            const successDiv     = document.getElementById('dca-success');
            const fractionalNote = document.getElementById('dca-fractional-note');

            if (!(currentQty > 0 && currentAvg > 0 && newPrice > 0 && targetAvg > 0)) {
                resultSection.style.display = 'none';
                return;
            }

            resultSection.style.display = 'block';

            // Already at target
            if (Math.abs(currentAvg - targetAvg) < 0.001) {
                errorDiv.textContent = 'Your current average already matches the target — no additional shares needed.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }

            // New price equals target — would need infinite shares
            if (Math.abs(newPrice - targetAvg) < 0.001) {
                errorDiv.textContent = 'The new buy price cannot equal the target average — you would need infinite shares.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }

            // n = currentQty * (targetAvg - currentAvg) / (newPrice - targetAvg)
            const exact = currentQty * (targetAvg - currentAvg) / (newPrice - targetAvg);

            if (exact <= 0) {
                let msg = 'Cannot reach that target average by buying at that price. ';
                if (targetAvg < currentAvg) {
                    msg += 'To lower your average, the new buy price must be below your target average.';
                } else {
                    msg += 'To raise your average, the new buy price must be above your target average.';
                }
                errorDiv.textContent = msg;
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }

            errorDiv.style.display = 'none';
            successDiv.style.display = 'block';

            const whole              = Math.ceil(exact);
            const additionalCost     = whole * newPrice;
            const newTotalShares     = currentQty + whole;
            const newTotalInvestment = currentQty * currentAvg + additionalCost;
            const achievedAvg        = newTotalInvestment / newTotalShares;

            document.getElementById('dca-shares-needed').textContent       = whole.toLocaleString();
            document.getElementById('dca-additional-cost').textContent      = fmt(additionalCost);
            document.getElementById('dca-new-total-shares').textContent     = newTotalShares.toLocaleString();
            document.getElementById('dca-new-total-investment').textContent = fmt(newTotalInvestment);
            document.getElementById('dca-achieved-avg').textContent         = fmt(achievedAvg);

            // Show note if ceiling changed the share count
            const hasFraction = (exact % 1) > 0.001;
            if (hasFraction) {
                fractionalNote.textContent = 'Exact shares needed: ' + exact.toFixed(4) + '. Rounded up to ' + whole + ' whole shares — your achieved average will be slightly better than your target.';
                fractionalNote.style.display = 'block';
            } else {
                fractionalNote.style.display = 'none';
            }
        }

        dcaInputs.addEventListener('input', calculateDCA);

        const dcaCopyBtn = document.getElementById('dca-copy-btn');
        if (dcaCopyBtn) dcaCopyBtn.addEventListener('click', function () {
            const shares = document.getElementById('dca-shares-needed').textContent;
            const cost   = document.getElementById('dca-additional-cost').textContent;
            const total  = document.getElementById('dca-new-total-shares').textContent;
            const inv    = document.getElementById('dca-new-total-investment').textContent;
            const avg    = document.getElementById('dca-achieved-avg').textContent;
            copyToClipboard(
                'DCA Calculator Results\n' +
                'Shares to Buy: '        + shares + '\n' +
                'Additional Cost: '      + cost   + '\n' +
                'New Total Shares: '     + total  + '\n' +
                'New Total Investment: ' + inv    + '\n' +
                'Achieved Average: '     + avg
            );
            showCopyFeedback(dcaCopyBtn);
        });
    }

});
