document.getElementById('importBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click(); // Trigger file input click
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Process the imported data
            jsonData.forEach((row, index) => {
                if (index > 0 && row.length >= 3) { // Skip header row
                    const empId = row[0];
                    const empFirstName = row[1];
                    const empLastName = row[2];

                    const employeeData = { empId, empFirstName, empLastName };
                    let employees = JSON.parse(localStorage.getItem('employees')) || [];
                    employees.push(employeeData);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
            });

            loadEmployeeData(); // Reload the employee data table
        };
        reader.readAsArrayBuffer(file);
    }
});

// Function to load employee data from localStorage and display it in the table
function loadEmployeeData() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const tbody = document.getElementById('employeeTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing data

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.empId}</td>
            <td>${employee.empFirstName}</td>
            <td>${employee.empLastName}</td>
        `;
        tbody.appendChild(row);
    });
}

// Export button functionality
document.getElementById('exportBtnDb').addEventListener('click', function() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Export the workbook
    XLSX.writeFile(workbook, 'employee_data.xlsx');
});