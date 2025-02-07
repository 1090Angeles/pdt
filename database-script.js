    document.getElementById('databaseBtn').addEventListener('click', function() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('database').style.display = 'block';
    loadpdtData();
});

document.getElementById('addPdtBtn').addEventListener('click', function() {
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const description = document.getElementById('description').value;

        if (brand && model && description) {
            const pdtData = { brand, model, description };
            let pdt = JSON.parse(localStorage.getItem('pdt')) || [];
            pdt.push(pdtData);
            localStorage.setItem('pdt', JSON.stringify(pdt));
            document.getElementById('pdtForm').reset();
            loadpdtData();
        }
    });

    function loadpdtData() {
        const pdt = JSON.parse(localStorage.getItem('pdt')) || [];
        const pdtTableBody = document.getElementById('pdtTable').querySelector('tbody');
        pdtTableBody.innerHTML = '';
        pdt.forEach((pdt, index) => {
            const row = `<tr>
                <td>${pdt.brand}</td>
                <td>${pdt.model}</td>
                <td>${pdt.description}</td>
                <td><button onclick="deletePdt(${index})">Delete</button></td> <!-- Delete button -->
            </tr>`;
            pdtTableBody.innerHTML += row;
        });
    }

    function deletePdt(index) {
        let pdt = JSON.parse(localStorage.getItem('pdt')) || [];
        pdt.splice(index, 1); // Remove the pdt at the specified index
        localStorage.setItem('pdt', JSON.stringify(pdt));
        loadpdtData(); // Reload the pdt data
    }

    // Load pdt data on page load
    window.onload = loadpdtData;

// Export Button
document.getElementById('exportBtn').addEventListener('click', function() {
    const pdtRecords = JSON.parse(localStorage.getItem('pdtRecords')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "PDT Number,Status,Employee ID,First Name,Last Name,Date,Time,Remarks\n"; // Added Remarks header
    pdtRecords.forEach(record => {
        const row = `${record.pdtNumber},${record.status},${record.employeeId},${record.firstName},${record.lastName},${record.date},${record.time},${record.remarks || ''}`; // Include remarks
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pdt_records.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
});

