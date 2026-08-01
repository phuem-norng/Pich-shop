// Shared helpers, storage, navigation, pagination
function saveToStorage() {
    sessionStorage.setItem('mem_suppliers_v9', JSON.stringify(suppliers));
    sessionStorage.setItem('mem_categories_v9', JSON.stringify(categories));
    sessionStorage.setItem('mem_customers_v9', JSON.stringify(customers));
    sessionStorage.setItem('mem_staff_v9', JSON.stringify(staff));
    sessionStorage.setItem('mem_products_v9', JSON.stringify(products));
    sessionStorage.setItem('mem_sales_v9', JSON.stringify(sales));
    sessionStorage.setItem('mem_logs_v9', JSON.stringify(inventoryLogs));
}

function renderData() {
    if (document.getElementById('employeeId-active')) renderStaffHeaderDropdown();
    if (document.getElementById('page-dashboard')) renderDashboard();
    if (document.getElementById('page-order-history')) renderOrderHistory();
    if (document.getElementById('page-sell')) renderSellPage();
    if (document.getElementById('page-stock')) renderStockPage();
    if (document.getElementById('page-customers')) renderCustomersPage();
    if (document.getElementById('page-suppliers')) renderSuppliersPage();
    if (document.getElementById('page-staff')) renderStaffPage();
}

function renderStaffHeaderDropdown() {
    let select = document.getElementById('employeeId-active');
    let savedUser = select.value;
    let options = '';
    staff.forEach(st => {
        options += `<option value="${st.employeeId}">${st.firstName} ${st.lastName} (${st.jobTitle})</option>`;
    });
    select.innerHTML = options;
    if(savedUser && select.querySelector(`option[value="${savedUser}"]`)) {
        select.value = savedUser;
    }
    updateActiveStaffProfile();
}

function updateActiveStaffProfile() {
    let staffId = document.getElementById('employeeId-active').value;
    let activeStaff = staff.find(s => s.employeeId === staffId);
    let name = activeStaff ? activeStaff.firstName : "System";
    document.getElementById('current-user-avatar').innerText = name.charAt(0).toUpperCase();
}

function getCustomerName(id) {
    let found = customers.find(c => c.customerId === id);
    return found ? `${found.firstName} ${found.lastName}`.trim() : "Walk-in Customer";
}

function getStaffName(id) {
    let found = staff.find(s => s.employeeId === id);
    return found ? `${found.firstName} ${found.lastName}` : "Unknown Staff";
}

function getCategoryName(id) {
    let found = categories.find(c => c.categoryId === id);
    return found ? found.categoryName : "General";
}

function getProductName(id) {
    let found = products.find(p => p.productId === id);
    return found ? found.productName : "Unknown Item";
}

function formatMoney(n) {
    return '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function toDateOnly(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function formatDateISO(d) {
    const x = new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, '0');
    const day = String(x.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function getPaginationPages(current, total, maxButtons = 8) {
    // When pages are 1..8, show all numbers.
    // From page count 9 upward: Previous · 1 2 3 4 5 … N · Next
    if (total <= maxButtons) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    if (current <= 5) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('…');
        pages.push(total);
        return pages;
    }

    if (current >= total - 3) {
        pages.push(1);
        pages.push('…');
        for (let i = total - 4; i <= total; i++) pages.push(i);
        return pages;
    }

    pages.push(1);
    pages.push('…');
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push('…');
    pages.push(total);
    return pages;
}

function renderListPagination(containerId, pageKey, totalRows) {
    const pager = document.getElementById(containerId);
    const totalPages = Math.max(1, Math.ceil(totalRows / LIST_ROWS_PER_PAGE));
    let page = listPages[pageKey] || 1;
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    listPages[pageKey] = page;

    const start = (page - 1) * LIST_ROWS_PER_PAGE;
    const end = Math.min(start + LIST_ROWS_PER_PAGE, totalRows);

    if (!pager) return { start, end, page, totalPages };

    // Show controls only when there are 9+ rows
    if (totalRows < 9) {
        pager.innerHTML = '';
        return { start: 0, end: totalRows, page: 1, totalPages: 1 };
    }

    const pages = getPaginationPages(page, totalPages, LIST_MAX_PAGE_BUTTONS);
    let html = `<button type="button" ${page === 1 ? 'disabled' : ''} onclick="setListPage('${pageKey}', ${page - 1})">Previous</button>`;
    pages.forEach(p => {
        if (p === '…') html += `<span class="page-ellipsis">…</span>`;
        else html += `<button type="button" class="${p === page ? 'active' : ''}" onclick="setListPage('${pageKey}', ${p})">${p}</button>`;
    });
    html += `<button type="button" ${page === totalPages ? 'disabled' : ''} onclick="setListPage('${pageKey}', ${page + 1})">Next</button>`;
    pager.innerHTML = html;
    return { start, end, page, totalPages };
}

function setListPage(pageKey, page) {
    listPages[pageKey] = page;
    if (pageKey === 'orderHistory') renderOrderHistory();
    else if (pageKey === 'stock' || pageKey === 'stockLogs') renderStockPage();
    else if (pageKey === 'customers') renderCustomersPage();
    else if (pageKey === 'suppliers') renderSuppliersPage();
    else if (pageKey === 'staff') renderStaffPage();
}
