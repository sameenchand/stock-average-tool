document.addEventListener("DOMContentLoaded", function () {
    // Add a new stock input row
    function addStockInput() {
        const container = document.getElementById('stock-inputs');
        const newRow = document.createElement('div');
        newRow.classList.add('stock-row');
        newRow.innerHTML = `
            <input type="number" name="price" placeholder="Enter Price ($)" step="0.01" required>
            <input type="number" name="quantity" placeholder="Enter Quantity" required>
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

    // Attach the "Add Stock" functionality to the button
    document.getElementById('add-stock-button').addEventListener('click', addStockInput);
});
