// App bootstrap — loads page HTML files, then wires navigation

const PAGE_FILES = {
    dashboard: 'pages/dashboard.html',
    sell: 'pages/sell.html',
    'order-history': 'pages/order-history.html',
    stock: 'pages/stock.html',
    customers: 'pages/customers.html',
    suppliers: 'pages/suppliers.html',
    staff: 'pages/staff.html'
};

const PAGE_STORAGE_KEY = 'pos_active_page';
const loadedPages = {};

function isValidPage(pageId) {
    return Object.prototype.hasOwnProperty.call(PAGE_FILES, pageId);
}

function getSavedPage() {
    const fromHash = (location.hash || '').replace(/^#\/?/, '');
    if (isValidPage(fromHash)) return fromHash;

    const fromStorage = sessionStorage.getItem(PAGE_STORAGE_KEY);
    if (isValidPage(fromStorage)) return fromStorage;

    return 'dashboard';
}

function rememberPage(pageId) {
    sessionStorage.setItem(PAGE_STORAGE_KEY, pageId);
    const nextHash = `#${pageId}`;
    if (location.hash !== nextHash) {
        history.replaceState(null, '', nextHash);
    }
}

async function ensurePageLoaded(pageId) {
    if (loadedPages[pageId]) return;
    const res = await fetch(PAGE_FILES[pageId]);
    if (!res.ok) throw new Error('Failed to load page: ' + pageId);
    const html = await res.text();
    const rootEl = document.getElementById('page-root');
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    while (wrap.firstChild) rootEl.appendChild(wrap.firstChild);
    loadedPages[pageId] = true;
}

function isMobileNav() {
    return window.matchMedia('(max-width: 900px)').matches;
}

function setMobileNavOpen(open) {
    const nav = document.getElementById('app-nav');
    const backdrop = document.getElementById('nav-backdrop');
    const toggle = document.getElementById('nav-toggle');
    if (!nav) return;

    document.body.classList.toggle('nav-open', open);
    if (backdrop) {
        backdrop.hidden = !open;
        backdrop.classList.toggle('visible', open);
    }
    if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
}

function openMobileNav() {
    setMobileNavOpen(true);
}

function closeMobileNav() {
    setMobileNavOpen(false);
}

function toggleMobileNav() {
    setMobileNavOpen(!document.body.classList.contains('nav-open'));
}

async function switchPage(pageId) {
    if (!isValidPage(pageId)) pageId = 'dashboard';
    await ensurePageLoaded(pageId);

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    const navBtn = document.getElementById(`nav-${pageId}`);
    if (navBtn) navBtn.classList.add('active');

    const pageTitles = {
        dashboard: 'Dashboard',
        sell: 'Sell Page (POS)',
        'order-history': 'Order History',
        stock: 'Stock',
        customers: 'Customers',
        suppliers: 'Suppliers',
        staff: 'Staff'
    };
    const titleEl = document.getElementById('header-page-title');
    if (titleEl) titleEl.textContent = pageTitles[pageId] || 'Dashboard';

    rememberPage(pageId);
    closeMobileNav();
    renderData();
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('dash-range-dropdown');
    if (dropdown && !dropdown.contains(e.target) && typeof closeDashRangeMenu === 'function') {
        closeDashRangeMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('nav-open')) {
        closeMobileNav();
        return;
    }
    if (document.getElementById('product-form-modal')?.classList.contains('open')) hideProductForm();
    if (document.getElementById('customer-form-modal')?.classList.contains('open')) hideCustomerForm();
    if (document.getElementById('supplier-form-modal')?.classList.contains('open')) hideSupplierForm();
    if (document.getElementById('staff-form-modal')?.classList.contains('open')) hideStaffForm();
});

window.addEventListener('resize', () => {
    if (!isMobileNav() && document.body.classList.contains('nav-open')) {
        closeMobileNav();
    }
});

window.addEventListener('hashchange', () => {
    const pageId = getSavedPage();
    switchPage(pageId);
});

(async function boot() {
    try {
        await Promise.all(Object.keys(PAGE_FILES).map(ensurePageLoaded));
        await switchPage(getSavedPage());
    } catch (err) {
        console.error(err);
        document.getElementById('page-root').innerHTML =
            `<div class="inv-empty">Failed to load app pages. Check the console.</div>`;
    }
})();
