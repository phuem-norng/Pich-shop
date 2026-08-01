// Dashboard page
function initDashRangeControls() {
    const monthSel = document.getElementById('dash-month');
    const yearSel = document.getElementById('dash-year');
    if (!monthSel || monthSel.options.length) return;

    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    months.forEach((name, i) => {
        monthSel.innerHTML += `<option value="${i}">${name}</option>`;
    });
    const now = new Date();
    const thisYear = now.getFullYear();
    for (let y = thisYear; y >= thisYear - 4; y--) {
        yearSel.innerHTML += `<option value="${y}">${y}</option>`;
    }
    monthSel.value = String(now.getMonth());
    yearSel.value = String(thisYear);

    document.getElementById('dash-to').value = formatDateISO(now);
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    document.getElementById('dash-from').value = formatDateISO(from);
}

function getDashDateRange() {
    const end = toDateOnly(new Date());
    let start = toDateOnly(new Date());
    let label = 'Last 7 days';
    let grain = 'day';

    if (dashRangeMode === '7d') {
        start.setDate(end.getDate() - 6);
        label = 'Last 7 days';
        grain = 'day';
    } else if (dashRangeMode === '28d') {
        start.setDate(end.getDate() - 27);
        label = 'Last 28 days';
        grain = 'day';
    } else if (dashRangeMode === '90d') {
        start.setDate(end.getDate() - 89);
        label = 'Last 90 days';
        grain = 'week';
    } else if (dashRangeMode === '365d') {
        start.setDate(end.getDate() - 364);
        label = 'Last 365 days';
        grain = 'month';
    } else if (dashRangeMode === 'month') {
        const m = parseInt(document.getElementById('dash-month').value, 10);
        const y = parseInt(document.getElementById('dash-year').value, 10);
        start = new Date(y, m, 1);
        const monthEnd = new Date(y, m + 1, 0);
        const today = toDateOnly(new Date());
        const endDate = monthEnd > today ? today : monthEnd;
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        label = `${monthNames[m]} ${y}`;
        grain = 'day';
        return { start: toDateOnly(start), end: toDateOnly(endDate), label, grain };
    } else if (dashRangeMode === 'custom') {
        const fromVal = document.getElementById('dash-from').value;
        const toVal = document.getElementById('dash-to').value;
        start = fromVal ? toDateOnly(fromVal) : start;
        const customEnd = toVal ? toDateOnly(toVal) : end;
        const days = Math.max(1, Math.round((customEnd - start) / 86400000) + 1);
        grain = days > 120 ? 'month' : (days > 45 ? 'week' : 'day');
        label = `${formatDateISO(start)} → ${formatDateISO(customEnd)}`;
        return { start, end: customEnd, label, grain };
    }

    return { start: toDateOnly(start), end: toDateOnly(end), label, grain };
}

const rangeLabels = {
    '7d': 'Last 7 days',
    '28d': 'Last 28 days',
    '90d': 'Last 90 days',
    '365d': 'Last 365 days',
    'month': 'ខែ / ឆ្នាំ',
    'custom': 'Custom'
};

function toggleDashRangeMenu(event) {
    event.stopPropagation();
    const trigger = document.getElementById('dash-range-trigger');
    const menu = document.getElementById('dash-range-menu');
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    trigger.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeDashRangeMenu() {
    const trigger = document.getElementById('dash-range-trigger');
    const menu = document.getElementById('dash-range-menu');
    if (!menu) return;
    menu.classList.remove('open');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
}

function setDashRange(mode) {
    dashRangeMode = mode;
    document.querySelectorAll('#dash-range-menu button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.range === mode);
    });
    document.getElementById('dash-range-label').textContent = rangeLabels[mode] || 'Quick range';
    document.getElementById('dash-month-range').classList.toggle('visible', mode === 'month');
    document.getElementById('dash-custom-range').classList.toggle('visible', mode === 'custom');
    closeDashRangeMenu();
    renderDashboard();
}

function applyMonthYearRange() {
    if (dashRangeMode !== 'month') return;
    renderDashboard();
}

function applyCustomRange() {
    const fromVal = document.getElementById('dash-from').value;
    const toVal = document.getElementById('dash-to').value;
    if (!fromVal || !toVal) {
        alert('Please select both From and To dates.');
        return;
    }
    if (toDateOnly(fromVal) > toDateOnly(toVal)) {
        alert('From date must be before To date.');
        return;
    }
    dashRangeMode = 'custom';
    renderDashboard();
}

function consolidateSales() {
    const consolidated = {};
    sales.forEach(s => {
        if (!consolidated[s.saleId]) {
            consolidated[s.saleId] = {
                saleId: s.saleId, customerId: s.customerId, employeeId: s.employeeId,
                paymentMethod: s.paymentMethod, saleDate: s.saleDate, totalAmount: 0, lines: []
            };
        }
        consolidated[s.saleId].totalAmount += parseFloat(s.totalAmount);
        consolidated[s.saleId].lines.push(s);
    });
    return Object.values(consolidated);
}

function saleInRange(saleDate, start, end) {
    const d = toDateOnly(saleDate);
    return d >= start && d <= end;
}

function buildTrendBuckets(start, end, grain) {
    const labels = [];
    const keys = [];
    if (grain === 'day') {
        const cur = new Date(start);
        while (cur <= end) {
            const key = formatDateISO(cur);
            keys.push(key);
            labels.push(cur.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
            cur.setDate(cur.getDate() + 1);
        }
    } else if (grain === 'week') {
        const cur = new Date(start);
        while (cur <= end) {
            const weekEnd = new Date(cur);
            weekEnd.setDate(weekEnd.getDate() + 6);
            if (weekEnd > end) weekEnd.setTime(end.getTime());
            const key = formatDateISO(cur);
            keys.push(key);
            labels.push(cur.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
            cur.setDate(cur.getDate() + 7);
        }
    } else {
        let y = start.getFullYear();
        let m = start.getMonth();
        const endY = end.getFullYear();
        const endM = end.getMonth();
        while (y < endY || (y === endY && m <= endM)) {
            const key = `${y}-${String(m + 1).padStart(2, '0')}`;
            keys.push(key);
            labels.push(new Date(y, m, 1).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }));
            m += 1;
            if (m > 11) { m = 0; y += 1; }
        }
    }
    return { labels, keys };
}

function trendKeyForDate(dateStr, grain, start) {
    const d = toDateOnly(dateStr);
    if (grain === 'day') return formatDateISO(d);
    if (grain === 'month') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const daysFromStart = Math.floor((d - start) / 86400000);
    const weekIndex = Math.floor(daysFromStart / 7);
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + weekIndex * 7);
    return formatDateISO(weekStart);
}

function renderDashboard() {
    if (!document.getElementById('dash-revenue')) return;
    initDashRangeControls();
    const { start, end, label, grain } = getDashDateRange();
    document.getElementById('dash-period-label').innerText = `Showing: ${label}`;
    document.getElementById('dash-chart-grain').innerText = grain === 'day' ? 'Daily' : (grain === 'week' ? 'Weekly' : 'Monthly');

    const listSales = consolidateSales().filter(s => saleInRange(s.saleDate, start, end));
    const lineSales = sales.filter(s => saleInRange(s.saleDate, start, end));

    const revenue = listSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const txCount = listSales.length;
    const lowStockCount = products.filter(p => parseInt(p.qty) <= 45).length;
    const rawCost = lineSales.reduce((sum, sale) => {
        const p = products.find(prod => prod.productId === sale.productId);
        return sum + (p ? parseFloat(p.costPrice) * parseInt(sale.qtySold) : 0);
    }, 0);
    const profit = revenue - rawCost;
    const avgOrder = txCount ? revenue / txCount : 0;

    document.getElementById('dash-revenue').innerText = formatMoney(revenue);
    document.getElementById('dash-transactions').innerText = txCount;
    document.getElementById('dash-profit').innerText = formatMoney(profit);
    document.getElementById('dash-low-stock').innerText = lowStockCount;
    document.getElementById('dash-revenue-hint').innerText = txCount ? `Avg order ${formatMoney(avgOrder)}` : 'No sales in this period';
    document.getElementById('dash-tx-hint').innerText = `${formatDateISO(start)} → ${formatDateISO(end)}`;

    // Revenue trend
    const buckets = buildTrendBuckets(start, end, grain);
    const revenueByBucket = Object.fromEntries(buckets.keys.map(k => [k, 0]));
    listSales.forEach(s => {
        const key = trendKeyForDate(s.saleDate, grain, start);
        if (revenueByBucket[key] !== undefined) revenueByBucket[key] += s.totalAmount;
    });
    updateRevenueChart(buckets.labels, buckets.keys.map(k => revenueByBucket[k] || 0));

    // Payment methods
    const payMap = {};
    listSales.forEach(s => {
        const method = s.paymentMethod || 'Other';
        payMap[method] = (payMap[method] || 0) + s.totalAmount;
    });
    updatePaymentChart(Object.keys(payMap), Object.values(payMap));

    // Top products
    const productRev = {};
    lineSales.forEach(s => {
        productRev[s.productId] = (productRev[s.productId] || 0) + parseFloat(s.totalAmount);
    });
    const topProducts = Object.entries(productRev)
        .map(([id, amt]) => ({ id, amt, name: getProductName(id) }))
        .sort((a, b) => b.amt - a.amt)
        .slice(0, 5);
    const topHtml = topProducts.length
        ? topProducts.map((p, i) => `
            <div class="top-product-row">
                <div class="top-product-rank">${i + 1}</div>
                <div class="top-product-meta">
                    <strong>${p.name}</strong>
                    <span>${((p.amt / revenue) * 100).toFixed(1)}% of period revenue</span>
                </div>
                <div class="top-product-amt">${formatMoney(p.amt)}</div>
            </div>`).join('')
        : `<div class="empty-chart">No product sales in this period</div>`;
    document.getElementById('dash-top-products').innerHTML = topHtml;

    // Recent transactions
    const rows = listSales
        .slice()
        .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate) || b.saleId.localeCompare(a.saleId))
        .slice(0, 12)
        .map(s => `<tr>
            <td><strong>#${s.saleId}</strong></td>
            <td>${getCustomerName(s.customerId)}</td>
            <td>${formatMoney(s.totalAmount)}</td>
            <td>${getStaffName(s.employeeId)}</td>
            <td><span class="status-badge status-fully">${s.paymentMethod}</span></td>
            <td>${s.saleDate}</td>
        </tr>`).join('');
    document.getElementById('dashboard-recent-sales').innerHTML = rows || `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No transactions in this period</td></tr>`;
}

function updateRevenueChart(labels, data) {
    const ctx = document.getElementById('chart-revenue');
    if (!ctx || typeof Chart === 'undefined') return;
    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Revenue',
                data,
                borderColor: '#b89347',
                backgroundColor: 'rgba(184,147,71,0.12)',
                fill: true,
                tension: 0.35,
                pointRadius: labels.length > 40 ? 0 : 3,
                pointHoverRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => formatMoney(ctx.parsed.y)
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: '#64748b', font: { size: 11 } } },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(226,220,207,0.7)' },
                    ticks: {
                        color: '#64748b',
                        font: { size: 11 },
                        callback: (v) => '$' + Number(v).toLocaleString()
                    }
                }
            }
        }
    });
}

function updatePaymentChart(labels, data) {
    const ctx = document.getElementById('chart-payments');
    if (!ctx || typeof Chart === 'undefined') return;
    if (paymentChart) paymentChart.destroy();
    const colors = ['#b89347', '#64748b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];
    paymentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No data'],
            datasets: [{
                data: labels.length ? data : [1],
                backgroundColor: labels.length ? labels.map((_, i) => colors[i % colors.length]) : ['#e2dccf'],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, boxHeight: 10, font: { size: 11 }, color: '#64748b', padding: 14 }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${formatMoney(ctx.parsed)}`
                    }
                }
            }
        }
    });
}
