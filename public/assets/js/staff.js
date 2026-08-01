// Staff page
function renderStaffPage() {
    if (!document.getElementById('staff-table-rows')) return;
    const searchEl = document.getElementById('staff-search');
    const query = (searchEl ? searchEl.value : '').toLowerCase();
    const matched = staff.filter(st => {
        const fullName = `${st.firstName} ${st.lastName}`.trim();
        const hay = `${st.employeeId} ${fullName} ${st.jobTitle} ${st.phoneNumber} ${st.email}`.toLowerCase();
        return !query || hay.includes(query);
    });

    const { start, end } = renderListPagination('staff-pagination', 'staff', matched.length);
    let rows = '';
    matched.slice(start, end).forEach(st => {
        const fullName = `${st.firstName} ${st.lastName}`.trim();
        rows += `<tr>
            <td>
                <div class="inv-product">
                    <span class="inv-product-name">${fullName || 'Unnamed'}</span>
                    <span class="inv-product-id">#${st.employeeId}</span>
                </div>
            </td>
            <td><span class="inv-chip">${st.jobTitle || '—'}</span></td>
            <td class="inv-money">$${parseFloat(st.hourlySalary || 0).toLocaleString()}</td>
            <td>${st.phoneNumber || '—'}</td>
            <td class="inv-material">${st.email || '—'}</td>
            <td>
                <div class="inv-actions">
                    <button class="btn-action edit" onclick="editStaff('${st.employeeId}')">Edit</button>
                    <button class="btn-action delete" onclick="deleteStaff('${st.employeeId}')">Delete</button>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('staff-table-rows').innerHTML = rows || `<tr><td colspan="6" class="inv-empty">No staff match your search</td></tr>`;
    document.getElementById('staff-item-count').textContent = `${matched.length} staff`;
}

function showStaffForm(isEdit = false) {
    const modal = document.getElementById('staff-form-modal');
    modal.classList.add('open');
    document.getElementById('staff-form-title').textContent = isEdit ? 'Edit Staff' : 'Add New Staff';
    document.getElementById('btn-save-staff').innerText = isEdit ? 'Update Staff' : 'Save Staff';
    if (!isEdit) {
        clearStaffFormFields();
        setTimeout(() => document.getElementById('employeeId').focus(), 50);
    }
}

function hideStaffForm() {
    document.getElementById('staff-form-modal').classList.remove('open');
    clearStaffFormFields();
}

function clearStaffFormFields() {
    document.getElementById('original-employee-id').value = '';
    document.getElementById('employeeId').value = '';
    document.getElementById('firstName-staff').value = '';
    document.getElementById('lastName-staff').value = '';
    document.getElementById('jobTitle').value = '';
    document.getElementById('hourlySalary').value = '';
    document.getElementById('phoneNumber-staff').value = '';
    document.getElementById('email-staff').value = '';
    document.getElementById('btn-save-staff').innerText = 'Save Staff';
    document.getElementById('staff-form-title').textContent = 'Add New Staff';
}

function clearStaffForm() {
    hideStaffForm();
}

function saveStaff() {
    let origId = document.getElementById('original-employee-id').value;
    let typedId = document.getElementById('employeeId').value.trim();
    let first = document.getElementById('firstName-staff').value;
    let last = document.getElementById('lastName-staff').value;
    let role = document.getElementById('jobTitle').value;
    let wage = document.getElementById('hourlySalary').value;
    let phone = document.getElementById('phoneNumber-staff').value;
    let email = document.getElementById('email-staff').value;

    if (!first) return alert("Name required.");

    let finalId = typedId !== "" ? typedId : (origId ? origId : "emp" + Date.now().toString().slice(-6));

    if (origId) {
        let index = staff.findIndex(st => st.employeeId === origId);
        if (index !== -1) {
            staff[index] = { employeeId: finalId, firstName: first, lastName: last, jobTitle: role, hourlySalary: wage, phoneNumber: phone, email };
            if (origId !== finalId) {
                sales.forEach(s => { if (s.employeeId === origId) s.employeeId = finalId; });
            }
        }
    } else {
        staff.push({ employeeId: finalId, firstName: first, lastName: last, jobTitle: role, hourlySalary: wage, phoneNumber: phone, email });
    }

    hideStaffForm();
    saveToStorage(); renderData();
}

function editStaff(id) {
    let st = staff.find(s => s.employeeId === id);
    if (!st) return;

    showStaffForm(true);
    document.getElementById('original-employee-id').value = st.employeeId;
    document.getElementById('employeeId').value = st.employeeId;
    document.getElementById('firstName-staff').value = st.firstName;
    document.getElementById('lastName-staff').value = st.lastName;
    document.getElementById('jobTitle').value = st.jobTitle;
    document.getElementById('hourlySalary').value = st.hourlySalary;
    document.getElementById('phoneNumber-staff').value = st.phoneNumber;
    document.getElementById('email-staff').value = st.email;
    setTimeout(() => document.getElementById('firstName-staff').focus(), 50);
}

function cancelStaffEdit() {
    hideStaffForm();
}

function deleteStaff(id) {
    staff = staff.filter(st => st.employeeId !== id);
    saveToStorage(); renderData();
}
