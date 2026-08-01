// Suppliers page
function renderSuppliersPage() {
    if (!document.getElementById('supplier-table-rows')) return;
    const searchEl = document.getElementById('supplier-search');
    const query = (searchEl ? searchEl.value : '').toLowerCase();
    const matched = suppliers.filter(s => {
        const hay = `${s.supplierId} ${s.companyName} ${s.city} ${s.phoneNumber} ${s.email} ${s.address}`.toLowerCase();
        return !query || hay.includes(query);
    });

    const { start, end } = renderListPagination('supplier-pagination', 'suppliers', matched.length);
    let rows = '';
    matched.slice(start, end).forEach(s => {
        rows += `<tr>
            <td>
                <div class="inv-product">
                    <span class="inv-product-name">${s.companyName}</span>
                    <span class="inv-product-id">#${s.supplierId}</span>
                </div>
            </td>
            <td><span class="inv-chip">${s.city || '—'}</span></td>
            <td>${s.phoneNumber || '—'}</td>
            <td class="inv-material">${s.email || '—'}</td>
            <td class="inv-material">${s.address || '—'}</td>
            <td>
                <div class="inv-actions">
                    <button class="btn-action edit" onclick="editSupplier('${s.supplierId}')">Edit</button>
                    <button class="btn-action delete" onclick="deleteSupplier('${s.supplierId}')">Delete</button>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('supplier-table-rows').innerHTML = rows || `<tr><td colspan="6" class="inv-empty">No suppliers match your search</td></tr>`;
    document.getElementById('supplier-item-count').textContent = `${matched.length} supplier${matched.length === 1 ? '' : 's'}`;
}

function showSupplierForm(isEdit = false) {
    const modal = document.getElementById('supplier-form-modal');
    modal.classList.add('open');
    document.getElementById('supplier-form-title').textContent = isEdit ? 'Edit Supplier' : 'Add New Supplier';
    document.getElementById('btn-save-supplier').innerText = isEdit ? 'Update Supplier' : 'Save Supplier';
    if (!isEdit) {
        clearSupplierFormFields();
        setTimeout(() => document.getElementById('supplierId-form').focus(), 50);
    }
}

function hideSupplierForm() {
    document.getElementById('supplier-form-modal').classList.remove('open');
    clearSupplierFormFields();
}

function clearSupplierFormFields() {
    document.getElementById('original-supplier-id').value = '';
    document.getElementById('supplierId-form').value = '';
    document.getElementById('companyName').value = '';
    document.getElementById('phoneNumber-supplier').value = '';
    document.getElementById('email-supplier').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('btn-save-supplier').innerText = 'Save Supplier';
    document.getElementById('supplier-form-title').textContent = 'Add New Supplier';
}

function saveSupplier() {
    let origId = document.getElementById('original-supplier-id').value;
    let typedId = document.getElementById('supplierId-form').value.trim();
    let name = document.getElementById('companyName').value;
    let phone = document.getElementById('phoneNumber-supplier').value;
    let email = document.getElementById('email-supplier').value;
    let addr = document.getElementById('address').value;
    let city = document.getElementById('city').value;

    if (!name) return alert("Company name is required.");

    let finalId = typedId !== "" ? typedId : (origId ? origId : "supplier" + Date.now().toString().slice(-6));

    if (origId) {
        let index = suppliers.findIndex(s => s.supplierId === origId);
        if (index !== -1) {
            suppliers[index] = { supplierId: finalId, companyName: name, phoneNumber: phone, email, address: addr, city };
            if (origId !== finalId) {
                products.forEach(p => { if (p.supplierId === origId) p.supplierId = finalId; });
            }
        }
    } else {
        suppliers.push({ supplierId: finalId, companyName: name, phoneNumber: phone, email, address: addr, city });
    }

    hideSupplierForm();
    saveToStorage(); renderData();
}

function editSupplier(id) {
    let s = suppliers.find(sup => sup.supplierId === id);
    if (!s) return;

    showSupplierForm(true);
    document.getElementById('original-supplier-id').value = s.supplierId;
    document.getElementById('supplierId-form').value = s.supplierId;
    document.getElementById('companyName').value = s.companyName;
    document.getElementById('phoneNumber-supplier').value = s.phoneNumber;
    document.getElementById('email-supplier').value = s.email;
    document.getElementById('address').value = s.address;
    document.getElementById('city').value = s.city;
    setTimeout(() => document.getElementById('companyName').focus(), 50);
}

function cancelSupplierEdit() {
    hideSupplierForm();
}

function deleteSupplier(id) {
    suppliers = suppliers.filter(s => s.supplierId !== id);
    saveToStorage(); renderData();
}
