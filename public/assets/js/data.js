// Shared seed data & state
// ===================================================================
// Base Data — Fully editable manually with ID input support
// ===================================================================
const fixedSuppliers = [
    { "supplierId": "supplierId101", "companyName": "Phnom Penh Precious Metals Refinery", "city": "Phnom Penh", "phoneNumber": "012 888 111", "email": "orders@ppmr.com", "address": "St. 271, Sangkat Boeung Kak I" },
    { "supplierId": "supplierId102", "companyName": "Pure Diamond Minings Co.", "city": "Antwerp", "phoneNumber": "015 456 789", "email": "sales@purediamonds.com", "address": "456 Brilliant Blvd" },
    { "supplierId": "supplierId103", "companyName": "Sihanoukville Silver & Stone Factory", "city": "Sihanoukville", "phoneNumber": "093 222 333", "email": "contact@svasilver.com", "address": "National Road 4" },
    { "supplierId": "supplierId104", "companyName": "Global Gemstone Express", "city": "kampot", "phoneNumber": "085 777 888", "email": "marcus@gemexpress.com", "address": "321 Sapphire St" },
    { "supplierId": "supplierId105", "companyName": "Luxury Import Chains Ltd.", "city": "Phnom Penh", "phoneNumber": "017 999 000", "email": "import@luxchains.com", "address": "Mao Tse Toung Blvd (245)" }
];

const fixedCategories = [
    { "categoryId": "categoryId101", "categoryName": "Bulk Rings", "description": "Wholesale bands and settings" },
    { "categoryId": "categoryId102", "categoryName": "Bulk Chains", "description": "Uncut and finished neck chains" },
    { "categoryId": "categoryId103", "categoryName": "Bulk Bracelets", "description": "Bangles and cuffs by the dozen" },
    { "categoryId": "categoryId104", "categoryName": "Bulk Earrings", "description": "Silver and gold studs in packs" },
    { "categoryId": "categoryId105", "categoryName": "Loose Gemstones", "description": "Parcel diamonds and sapphires" }
];

const fixedCustomers = [
    { "customerId": "walk-in", "firstName": "Walk-in Customer", "lastName": "", "phoneNumber": "N/A", "email": "N/A", "loyaltyStatus": "Standard" },
    { "customerId": "customer101", "firstName": "Ly Hour Gold Shop", "lastName": "(Sangkat Phsar Thmey)", "phoneNumber": "012 345 678", "email": "contact@lyhourgold.com", "loyaltyStatus": "Tier 1" },
    { "customerId": "customer102", "firstName": "Sorya Diamond Boutique", "lastName": "(Sangkat Phsar Thmey III)", "phoneNumber": "016 789 012", "email": "sales@soryadiamonds.com", "loyaltyStatus": "Standard" },
    { "customerId": "customer103", "firstName": "Toul Tom Poung Silver Goods", "lastName": "(Sangkat Toul Tom Poung)", "phoneNumber": "098 456 123", "email": "ttp@silvergoods.com", "loyaltyStatus": "Standard" },
    { "customerId": "customer104", "firstName": "Preah Sihanouk Luxury Gems", "lastName": "(Sangkat Chaktomuk)", "phoneNumber": "015 555 777", "email": "vip@sihanoukgems.com", "loyaltyStatus": "Tier 2" },
    { "customerId": "customer105", "firstName": "Olympia Plaza Jewelry Store", "lastName": "(Sangkat Veal Vong)", "phoneNumber": "089 222 444", "email": "manager@olympiajewelry.com", "loyaltyStatus": "Standard" }
];

const fixedStaff = [
    { "employeeId": "employeeId101", "firstName": "Daly", "lastName": "Seng", "jobTitle": "Warehouse Manager", "hourlySalary": "12.5", "phoneNumber": "012 999 888", "email": "sengdaly@wholesale.com" },
    { "employeeId": "employeeId102", "firstName": "Rottanak", "lastName": "Um", "jobTitle": "Lead Appraiser", "hourlySalary": "15", "phoneNumber": "015 444 333", "email": "umrottanak@wholesale.com" },
    { "employeeId": "employeeId103", "firstName": "Sokmeng", "lastName": "Sriv", "jobTitle": "B2B Accounts Agent", "hourlySalary": "8.5", "phoneNumber": "093 777 666", "email": "srivsokmeng@wholesale.com" },
    { "employeeId": "employeeId104", "firstName": "Sereypheap", "lastName": "Phorn", "jobTitle": "B2B Accounts Agent", "hourlySalary": "8.5", "phoneNumber": "011 222 333", "email": "phornpheap@wholesale.com" },
    { "employeeId": "employeeId105", "firstName": "Socheat", "lastName": "Yen", "jobTitle": "Warehouse Security Chief", "hourlySalary": "7", "phoneNumber": "085 444 555", "email": "yensocheat@wholesale.com" }
];

const fixedProducts = [
    { "productId": "productId101", "productName": "Classic Gold Bands (Pack of 10)", "categoryId": "categoryId101", "retailPrice": "2500", "costPrice": "1500", "qty": "150", "material": "14k Yellow Gold", "supplierId": "supplierId101", "barcode": "BAR-GOLD-01" },
    { "productId": "productId102", "productName": "Solitaire Diamond Settings", "categoryId": "categoryId101", "retailPrice": "8000", "costPrice": "5000", "qty": "30", "material": "Platinum", "supplierId": "supplierId102", "barcode": "BAR-DIAM-02" },
    { "productId": "productId103", "productName": "Silver Hoop Earrings (Pack of 50)", "categoryId": "categoryId104", "retailPrice": "450", "costPrice": "200", "qty": "400", "material": "Sterling Silver", "supplierId": "supplierId103", "barcode": "BAR-SILV-03" },
    { "productId": "productId104", "productName": "Sapphire Pendants (Pack of 5)", "categoryId": "categoryId102", "retailPrice": "1800", "costPrice": "1000", "qty": "50", "material": "18k White Gold", "supplierId": "supplierId104", "barcode": "BAR-SAPP-04" },
    { "productId": "productId105", "productName": "Tennis Bracelets (Pack of 5)", "categoryId": "categoryId103", "retailPrice": "5000", "costPrice": "3000", "qty": "40", "material": "14k Rose Gold", "supplierId": "supplierId105", "barcode": "BAR-ROSE-05" }
];

const todayStr = new Date().toISOString().split('T')[0];
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}
const fixedSales = [
    { "saleId": "saleId101", "customerId": "customer101", "employeeId": "employeeId103", "productId": "productId101", "qtySold": "2", "totalAmount": "5000", "paymentMethod": "ABA", "saleDate": daysAgo(120) },
    { "saleId": "saleId101", "customerId": "customer101", "employeeId": "employeeId103", "productId": "productId103", "qtySold": "5", "totalAmount": "2250", "paymentMethod": "ABA", "saleDate": daysAgo(120) },
    { "saleId": "saleId102", "customerId": "customer102", "employeeId": "employeeId104", "productId": "productId102", "qtySold": "1", "totalAmount": "8000", "paymentMethod": "ABA", "saleDate": daysAgo(95) },
    { "saleId": "saleId103", "customerId": "customer103", "employeeId": "employeeId103", "productId": "productId103", "qtySold": "10", "totalAmount": "4500", "paymentMethod": "Cash", "saleDate": daysAgo(80) },
    { "saleId": "saleId104", "customerId": "customer104", "employeeId": "employeeId104", "productId": "productId105", "qtySold": "2", "totalAmount": "10000", "paymentMethod": "ABA", "saleDate": daysAgo(60) },
    { "saleId": "saleId105", "customerId": "customer105", "employeeId": "employeeId103", "productId": "productId104", "qtySold": "3", "totalAmount": "5400", "paymentMethod": "ABA", "saleDate": daysAgo(45) },
    { "saleId": "saleId106", "customerId": "customer101", "employeeId": "employeeId104", "productId": "productId101", "qtySold": "4", "totalAmount": "10000", "paymentMethod": "Cash", "saleDate": daysAgo(35) },
    { "saleId": "saleId107", "customerId": "customer102", "employeeId": "employeeId103", "productId": "productId102", "qtySold": "1", "totalAmount": "8000", "paymentMethod": "ABA", "saleDate": daysAgo(28) },
    { "saleId": "saleId108", "customerId": "customer103", "employeeId": "employeeId104", "productId": "productId103", "qtySold": "8", "totalAmount": "3600", "paymentMethod": "Cash", "saleDate": daysAgo(21) },
    { "saleId": "saleId109", "customerId": "customer104", "employeeId": "employeeId103", "productId": "productId105", "qtySold": "1", "totalAmount": "5000", "paymentMethod": "ABA", "saleDate": daysAgo(14) },
    { "saleId": "saleId110", "customerId": "customer105", "employeeId": "employeeId104", "productId": "productId104", "qtySold": "2", "totalAmount": "3600", "paymentMethod": "ABA", "saleDate": daysAgo(10) },
    { "saleId": "saleId111", "customerId": "customer101", "employeeId": "employeeId103", "productId": "productId101", "qtySold": "1", "totalAmount": "2500", "paymentMethod": "Cash", "saleDate": daysAgo(7) },
    { "saleId": "saleId112", "customerId": "customer102", "employeeId": "employeeId104", "productId": "productId103", "qtySold": "6", "totalAmount": "2700", "paymentMethod": "ABA", "saleDate": daysAgo(5) },
    { "saleId": "saleId113", "customerId": "customer103", "employeeId": "employeeId103", "productId": "productId102", "qtySold": "1", "totalAmount": "8000", "paymentMethod": "ABA", "saleDate": daysAgo(3) },
    { "saleId": "saleId114", "customerId": "customer104", "employeeId": "employeeId104", "productId": "productId105", "qtySold": "2", "totalAmount": "10000", "paymentMethod": "ABA", "saleDate": daysAgo(1) },
    { "saleId": "saleId115", "customerId": "customer105", "employeeId": "employeeId103", "productId": "productId104", "qtySold": "1", "totalAmount": "1800", "paymentMethod": "Cash", "saleDate": todayStr }
];

const fixedInventoryLogs = [
    { "inventoryId": "inventoryId101", "productId": "productId101", "logDate": daysAgo(150), "movementType": "IN", "quantityChanged": "200" },
    { "inventoryId": "inventoryId102", "productId": "productId101", "logDate": daysAgo(120), "movementType": "OUT", "quantityChanged": "2" },
    { "inventoryId": "inventoryId103", "productId": "productId103", "logDate": daysAgo(140), "movementType": "IN", "quantityChanged": "500" },
    { "inventoryId": "inventoryId104", "productId": "productId103", "logDate": daysAgo(120), "movementType": "OUT", "quantityChanged": "5" },
    { "inventoryId": "inventoryId105", "productId": "productId102", "logDate": daysAgo(95), "movementType": "OUT", "quantityChanged": "1" }
];

// Session Sync
let suppliers = JSON.parse(sessionStorage.getItem('mem_suppliers_v9')) || fixedSuppliers;
let categories = JSON.parse(sessionStorage.getItem('mem_categories_v9')) || fixedCategories;
let customers = JSON.parse(sessionStorage.getItem('mem_customers_v9')) || fixedCustomers;
let staff = JSON.parse(sessionStorage.getItem('mem_staff_v9')) || fixedStaff;
let products = JSON.parse(sessionStorage.getItem('mem_products_v9')) || fixedProducts;
let sales = JSON.parse(sessionStorage.getItem('mem_sales_v9')) || fixedSales;
let inventoryLogs = JSON.parse(sessionStorage.getItem('mem_logs_v9')) || fixedInventoryLogs;
let cart = [];
let dashRangeMode = '7d';
let revenueChart = null;
let paymentChart = null;

const LIST_ROWS_PER_PAGE = 8;
const LIST_MAX_PAGE_BUTTONS = 8;
let listPages = { stock: 1, stockLogs: 1, customers: 1, suppliers: 1, staff: 1, orderHistory: 1 };
