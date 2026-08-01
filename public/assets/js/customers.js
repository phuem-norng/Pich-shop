// Customers page
function getCustomerTotalSpent(id) {
    return sales
        .filter(s => s.customerId === id)
        .reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);
}

function renderCustomersPage() {
    if (!document.getElementById('customer-search')) return;
    let query = document.getElementById('customer-search').value.toLowerCase();
    const matched = customers.filter(c => {
        let fullName = `${c.firstName} ${c.lastName}`.trim();
        return fullName.toLowerCase().includes(query) ||
            (c.phoneNumber || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            c.customerId.toLowerCase().includes(query);
    });

    const { start, end } = renderListPagination('customer-pagination', 'customers', matched.length);
    let rows = '';
    matched.slice(start, end).forEach(c => {
        let spent = getCustomerTotalSpent(c.customerId);
        let tierClass = c.loyaltyStatus === 'Tier 2' ? 'tier-2' : (c.loyaltyStatus === 'Tier 1' ? 'tier-1' : 'tier-standard');
        let isWalkIn = c.customerId === 'walk-in' || c.customerId === 'customer-walkin';
        rows += `<tr>
            <td>
                <div class="inv-product">
                    <span class="inv-product-name">${c.firstName || 'Unnamed'}</span>
                    <span class="inv-product-id">#${c.customerId}</span>
                </div>
            </td>
            <td class="inv-material">${c.lastName || '—'}</td>
            <td>${c.phoneNumber || '—'}</td>
            <td class="inv-material">${c.email || '—'}</td>
            <td><span class="inv-chip ${tierClass}">${c.loyaltyStatus || 'Standard'}</span></td>
            <td class="inv-money">$${spent.toLocaleString()}</td>
            <td>
                ${!isWalkIn ? `<div class="inv-actions">
                    <button class="btn-action edit" onclick="editCustomer('${c.customerId}')">Edit</button>
                    <button class="btn-action delete" onclick="deleteCustomer('${c.customerId}')">Delete</button>
                </div>` : `<span class="inv-material">System</span>`}
            </td>
        </tr>`;
    });
    document.getElementById('customer-table-rows').innerHTML = rows || `<tr><td colspan="7" class="inv-empty">No customers match your search</td></tr>`;
    document.getElementById('customer-item-count').textContent = `${matched.length} profile${matched.length === 1 ? '' : 's'}`;
}

function showCustomerForm(isEdit = false) {
    const modal = document.getElementById('customer-form-modal');
    modal.classList.add('open');
    document.getElementById('customer-form-title').textContent = isEdit ? 'Edit Customer' : 'Add New Customer';
    document.getElementById('btn-save-customer').innerText = isEdit ? 'Update Profile' : 'Save Profile';
    if (!isEdit) {
        clearCustomerFormFields();
        setTimeout(() => document.getElementById('customerId').focus(), 50);
    }
}

function hideCustomerForm() {
    document.getElementById('customer-form-modal').classList.remove('open');
    clearCustomerFormFields();
}

function clearCustomerFormFields() {
    document.getElementById('original-customer-id').value = '';
    document.getElementById('customerId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('email').value = '';
    document.getElementById('loyaltyStatus').value = 'Standard';
    document.getElementById('btn-save-customer').innerText = 'Save Profile';
    document.getElementById('customer-form-title').textContent = 'Add New Customer';
}

function clearCustomerForm() {
    hideCustomerForm();
}

function saveCustomer() {
    let origId = document.getElementById('original-customer-id').value;
    let typedId = document.getElementById('customerId').value.trim();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let phone = document.getElementById('phoneNumber').value;
    let email = document.getElementById('email').value;
    let loyalty = document.getElementById('loyaltyStatus').value;

    if (!firstName) return alert("Name is required.");

    let finalId = typedId !== "" ? typedId : (origId ? origId : "customer" + Date.now().toString().slice(-6));

    if (origId) {
        let index = customers.findIndex(c => c.customerId === origId);
        if (index !== -1) {
            customers[index] = { customerId: finalId, firstName, lastName, phoneNumber: phone, email, loyaltyStatus: loyalty };
            if (origId !== finalId) {
                sales.forEach(s => { if (s.customerId === origId) s.customerId = finalId; });
            }
        }
    } else {
        customers.push({ customerId: finalId, firstName, lastName, phoneNumber: phone, email, loyaltyStatus: loyalty });
    }

    hideCustomerForm();
    saveToStorage(); renderData();
}

function editCustomer(id) {
    let c = customers.find(cust => cust.customerId === id);
    if (!c) return;

    showCustomerForm(true);
    document.getElementById('original-customer-id').value = c.customerId;
    document.getElementById('customerId').value = c.customerId;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('email').value = c.email;
    document.getElementById('loyaltyStatus').value = c.loyaltyStatus;
    setTimeout(() => document.getElementById('firstName').focus(), 50);
}

function cancelCustomerEdit() {
    hideCustomerForm();
}

function deleteCustomer(id) {
    if(id === 'customer-walkin' || id === 'walk-in') return;
    customers = customers.filter(c => c.customerId !== id);
    saveToStorage(); renderData();
}
