// Order History page
function renderOrderHistory() {
    if (!document.getElementById('order-history-timeline')) return;
    const allRows = sales
        .slice()
        .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate) || String(b.saleId).localeCompare(String(a.saleId)));

    const totalRows = allRows.length;
    const timeline = document.getElementById('order-history-timeline');
    const meta = document.getElementById('order-history-meta');

    if (!totalRows) {
        timeline.innerHTML = `<div class="inv-empty">No log history found.</div>`;
        meta.textContent = '';
        renderListPagination('order-history-pagination', 'orderHistory', 0);
        return;
    }

    const { start, end } = renderListPagination('order-history-pagination', 'orderHistory', totalRows);
    const pageRows = allRows.slice(start, end);

    const groups = {};
    pageRows.forEach(sale => {
        if (!groups[sale.saleDate]) groups[sale.saleDate] = [];
        groups[sale.saleDate].push(sale);
    });
    const pageDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    let containerHtml = '';
    pageDates.forEach(date => {
        const dayTotal = groups[date].reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);
        containerHtml += `
            <div class="date-section">
                <div class="date-header">${date}</div>
                <div class="inventory-card" style="margin-bottom:0;">
                    <div class="inventory-card-header">
                        <h3>${groups[date].length} sale line${groups[date].length === 1 ? '' : 's'}</h3>
                        <span class="inv-count">${formatMoney(dayTotal)}</span>
                    </div>
                    <div class="inventory-table-wrap" style="max-height:none;">
                        <table class="inventory-table">
                            <thead>
                                <tr>
                                    <th>Sale ID</th>
                                    <th>Customer Name</th>
                                    <th>Item Sold</th>
                                    <th>Qty</th>
                                    <th>Payment</th>
                                    <th>Handled By</th>
                                    <th>Subtotal</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>`;
        groups[date].forEach(sale => {
            containerHtml += `
                <tr>
                    <td><span class="inv-product-id">#${sale.saleId}</span></td>
                    <td>${getCustomerName(sale.customerId)}</td>
                    <td>${getProductName(sale.productId)}</td>
                    <td>${sale.qtySold}</td>
                    <td><span class="inv-chip">${sale.paymentMethod}</span></td>
                    <td>${getStaffName(sale.employeeId)}</td>
                    <td class="inv-money">$${parseFloat(sale.totalAmount).toLocaleString()}</td>
                    <td><span class="stock-badge ok"><span class="dot"></span>Paid</span></td>
                </tr>`;
        });
        containerHtml += `</tbody></table></div></div></div>`;
    });

    meta.textContent = `Showing rows ${start + 1}–${end} of ${totalRows}`;
    timeline.innerHTML = containerHtml;
    const pageEl = document.getElementById('page-order-history');
    if (pageEl) pageEl.scrollTop = 0;
}
