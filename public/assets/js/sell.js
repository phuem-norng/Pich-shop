// Sell / POS page
function renderSellPage() {
    if (!document.getElementById('sell-products-grid')) return;
    let query = document.getElementById('sell-search').value.toLowerCase();
    let gridHtml = '';
    
    products.forEach(p => {
        if (p.productName.toLowerCase().includes(query) || getCategoryName(p.categoryId).toLowerCase().includes(query)) {
            let lowStockWarning = parseInt(p.qty) <= 45 ? '<b style="color:#ef4444; display:block; margin-top:4px; font-size:0.75rem;">⚠️ Low Stock</b>' : '';
            gridHtml += `
                <div class="product-item" onclick="addToCart('${p.productId}')">
                    <h4>${p.productName}</h4>
                    <p>$${parseFloat(p.retailPrice).toLocaleString()}</p>
                    <span>Stock: ${p.qty}</span>
                    ${lowStockWarning}
                </div>`;
        }
    });
    document.getElementById('sell-products-grid').innerHTML = gridHtml;

    let custSelect = document.getElementById('customerId-cart');
    let options = '';
    customers.forEach(c => { options += `<option value="${c.customerId}">${c.firstName} ${c.lastName}</option>`; });
    custSelect.innerHTML = options;

    renderCart();
}

function addToCart(id) {
    let p = products.find(prod => prod.productId === id);
    if (!p || parseInt(p.qty) <= 0) return alert("Boutique piece is out of stock!");

    let cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        if (cartItem.qty >= parseInt(p.qty)) return alert("Limit of remaining stock reached!");
        cartItem.qty++;
    } else {
        cart.push({ id: p.productId, name: p.productName, price: parseFloat(p.retailPrice), qty: 1 });
    }
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    let cartHtml = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        cartHtml += `
            <div class="cart-row">
                <div><strong>${item.name}</strong><br><small>${item.qty} x $${item.price.toLocaleString()}</small></div>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>`;
    });
    document.getElementById('cart-items-container').innerHTML = cartHtml;
    document.getElementById('cart-total-amount').innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

function checkout() {
    if (cart.length === 0) return alert("Checkout session is empty.");
    
    let customerId = document.getElementById('customerId-cart').value;
    let employeeId = document.getElementById('employeeId-active').value || staff[0].employeeId;
    let customIdInput = document.getElementById('custom-sale-id').value.trim();
    let newSaleId = customIdInput !== "" ? customIdInput : "sale" + Date.now().toString().slice(-6);

    cart.forEach(cartItem => {
        let p = products.find(prod => prod.productId === cartItem.id);
        if (p) {
            p.qty = (parseInt(p.qty) - cartItem.qty).toString();
            
            let logId = "log" + Date.now().toString().slice(-6);
            inventoryLogs.push({
                inventoryId: logId,
                productId: p.productId,
                logDate: new Date().toISOString().split('T')[0],
                movementType: "OUT",
                quantityChanged: cartItem.qty.toString()
            });
        }
    });

    let paymentMethod = document.getElementById('paymentMethod-cart').value;
    let dateStr = new Date().toISOString().split('T')[0];

    cart.forEach(item => {
        sales.push({
            saleId: newSaleId, customerId: customerId, employeeId: employeeId,
            productId: item.id, qtySold: item.qty.toString(), totalAmount: (item.price * item.qty).toString(),
            paymentMethod: paymentMethod, saleDate: dateStr
        });
    });

    cart = [];
    document.getElementById('custom-sale-id').value = '';
    saveToStorage();
    alert(`Sale registered safely with ID: ${newSaleId}`);
    switchPage('dashboard');
}
