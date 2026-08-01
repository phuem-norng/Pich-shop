// Stock & Cataloging page
function renderStockPage() {
    if (!document.getElementById('stock-search')) return;
    let query = document.getElementById('stock-search').value.toLowerCase();

    let catSelect = document.getElementById('categoryId');
    if (catSelect) {
        let catOptions = '';
        categories.forEach(c => { catOptions += `<option value="${c.categoryId}">${c.categoryName}</option>`; });
        catSelect.innerHTML = catOptions;
    }

    let suppSelect = document.getElementById('supplierId');
    if (suppSelect) {
        let suppOptions = '';
        suppliers.forEach(s => { suppOptions += `<option value="${s.supplierId}">${s.companyName}</option>`; });
        suppSelect.innerHTML = suppOptions;
    }

    const matched = products.filter(p =>
        p.productName.toLowerCase().includes(query) ||
        (p.material && p.material.toLowerCase().includes(query)) ||
        getCategoryName(p.categoryId).toLowerCase().includes(query) ||
        p.productId.toLowerCase().includes(query)
    );

    const { start, end } = renderListPagination('stock-pagination', 'stock', matched.length);
    const pageItems = matched.slice(start, end);

    let rows = '';
    pageItems.forEach(p => {
        let stockVal = parseInt(p.qty);
        let isLow = stockVal <= 45;
        let stockBadge = isLow
            ? `<span class="stock-badge low"><span class="dot"></span>${stockVal} · Low</span>`
            : `<span class="stock-badge ok"><span class="dot"></span>${stockVal} · In stock</span>`;
        rows += `<tr class="${isLow ? 'row-low' : ''}">
            <td>
                <div class="inv-product">
                    <span class="inv-product-name">${p.productName}</span>
                    <span class="inv-product-id">#${p.productId}</span>
                </div>
            </td>
            <td class="inv-material">${p.material || '—'}</td>
            <td><span class="inv-chip">${getCategoryName(p.categoryId)}</span></td>
            <td class="inv-money">$${parseFloat(p.retailPrice).toLocaleString()}</td>
            <td class="inv-money cost">$${parseFloat(p.costPrice).toLocaleString()}</td>
            <td>${stockBadge}</td>
            <td>
                <div class="inv-actions">
                    <button class="btn-restock" onclick="restockProduct('${p.productId}')">+ Restock</button>
                    <button class="btn-action edit" onclick="editProduct('${p.productId}')">Edit</button>
                    <button class="btn-action delete" onclick="deleteProduct('${p.productId}')">Delete</button>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('stock-table-rows').innerHTML = rows || `<tr><td colspan="7" class="inv-empty">No products match your search</td></tr>`;
    document.getElementById('inventory-item-count').textContent = `${matched.length} item${matched.length === 1 ? '' : 's'}`;

    const logs = inventoryLogs.slice().reverse();
    const logPage = renderListPagination('stock-logs-pagination', 'stockLogs', logs.length);
    const pageLogs = logs.slice(logPage.start, logPage.end);
    let auditRows = '';
    pageLogs.forEach(log => {
        const typeClass = log.movementType === 'IN' ? 'ok' : 'low';
        auditRows += `<tr>
            <td><span class="inv-product-id">${log.inventoryId}</span></td>
            <td>${getProductName(log.productId)}</td>
            <td>${log.logDate}</td>
            <td><span class="stock-badge ${typeClass}"><span class="dot"></span>${log.movementType}</span></td>
            <td class="inv-money">${log.quantityChanged}</td>
        </tr>`;
    });
    document.getElementById('inventory-log-rows').innerHTML = auditRows || `<tr><td colspan="5" class="inv-empty">No movement logs yet</td></tr>`;
}

function showProductForm(isEdit = false) {
    // Ensure category/supplier options are ready before focusing the dialog
    renderStockPage();
    const modal = document.getElementById('product-form-modal');
    modal.classList.add('open');
    document.getElementById('product-form-title').textContent = isEdit ? 'Edit Product' : 'Add New Product';
    document.getElementById('btn-save-product').innerText = isEdit ? 'Update Product' : 'Save Product';
    if (!isEdit) {
        clearProductFormFields();
        setTimeout(() => document.getElementById('productId').focus(), 50);
    }
}

function hideProductForm() {
    document.getElementById('product-form-modal').classList.remove('open');
    clearProductFormFields();
}


function clearProductFormFields() {
    document.getElementById('original-product-id').value = '';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('retailPrice').value = '';
    document.getElementById('costPrice').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('material').value = '';
    document.getElementById('btn-save-product').innerText = 'Save Product';
    document.getElementById('product-form-title').textContent = 'Add New Product';
}

function clearProductForm() {
    hideProductForm();
}

function saveProduct() {
    let origId = document.getElementById('original-product-id').value;
    let typedId = document.getElementById('productId').value.trim();
    let name = document.getElementById('productName').value;
    let categoryId = document.getElementById('categoryId').value;
    let retailPrice = document.getElementById('retailPrice').value;
    let costPrice = document.getElementById('costPrice').value;
    let qty = document.getElementById('qty').value;
    let material = document.getElementById('material').value;
    let supplierId = document.getElementById('supplierId').value;

    if (!name || !retailPrice || !qty) return alert("Please fill details.");

    let finalId = typedId !== "" ? typedId : (origId ? origId : "prod" + Date.now().toString().slice(-6));

    if (origId) {
        let index = products.findIndex(p => p.productId === origId);
        if (index !== -1) {
            let oldQty = parseInt(products[index].qty);
            let newQty = parseInt(qty);

            // Update product reference and ID
            products[index] = { ...products[index], productId: finalId, productName: name, categoryId, retailPrice, costPrice, qty, material, supplierId };

            // Relink logs/sales if ID was updated
            if (origId !== finalId) {
                inventoryLogs.forEach(l => { if (l.productId === origId) l.productId = finalId; });
                sales.forEach(s => { if (s.productId === origId) s.productId = finalId; });
            }

            let delta = newQty - oldQty;
            if (delta !== 0) {
                inventoryLogs.push({
                    inventoryId: "log" + Date.now().toString().slice(-6),
                    productId: finalId,
                    logDate: new Date().toISOString().split('T')[0],
                    movementType: delta > 0 ? "IN" : "ADJUSTMENT (OUT)",
                    quantityChanged: Math.abs(delta).toString()
                });
            }
        }
    } else {
        products.push({
            productId: finalId, productName: name, categoryId, retailPrice,
            costPrice, qty, material, supplierId, barcode: `BAR-${Date.now()}`
        });

        inventoryLogs.push({
            inventoryId: "log" + Date.now().toString().slice(-6),
            productId: finalId,
            logDate: new Date().toISOString().split('T')[0],
            movementType: "IN",
            quantityChanged: qty.toString()
        });
    }

    hideProductForm();
    saveToStorage(); renderData();
}

function editProduct(id) {
    let p = products.find(prod => prod.productId === id);
    if (!p) return;

    showProductForm(true);
    document.getElementById('original-product-id').value = p.productId;
    document.getElementById('productId').value = p.productId;
    document.getElementById('productName').value = p.productName;
    document.getElementById('categoryId').value = p.categoryId;
    document.getElementById('retailPrice').value = p.retailPrice;
    document.getElementById('costPrice').value = p.costPrice;
    document.getElementById('qty').value = p.qty;
    document.getElementById('material').value = p.material;
    document.getElementById('supplierId').value = p.supplierId;
    setTimeout(() => document.getElementById('productName').focus(), 50);
}

function cancelProductEdit() {
    hideProductForm();
}

function restockProduct(id) {
    let p = products.find(prod => prod.productId === id);
    if (!p) return;
    let input = prompt(`Add how many units to "${p.productName}"? (currently ${p.qty} in stock)`, "10");
    if (input === null) return;
    let addQty = parseInt(input);
    if (isNaN(addQty) || addQty === 0) return alert("Enter a valid, non-zero number.");

    p.qty = (parseInt(p.qty) + addQty).toString();

    inventoryLogs.push({
        inventoryId: "log" + Date.now().toString().slice(-6),
        productId: p.productId,
        logDate: new Date().toISOString().split('T')[0],
        movementType: addQty > 0 ? "IN" : "ADJUSTMENT (OUT)",
        quantityChanged: Math.abs(addQty).toString()
    });

    saveToStorage(); renderData();
}

function deleteProduct(id) {
    products = products.filter(p => p.productId !== id);
    saveToStorage(); renderData();
}
