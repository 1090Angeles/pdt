document.getElementById('databaseBtn').addEventListener('click', function() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('database').style.display = 'block';
    loaddataPdt(); // Call the correct function to load data
});

function populatepdtDetails() {
    const serialInput = document.getElementById('serial').value;
    const products = JSON.parse(localStorage.getItem('pdt')) || [];
    
    // Find the product with the matching serial number
    const product = products.find(p => p.serial === serialInput);
    
    if (product) {
        // Populate the fields if the product is found
        document.getElementById('brand').value = product.brand;
        document.getElementById('model').value = product.model;
        document.getElementById('description').value = product.description;
    } else {
        // If no product is found, fetch the last known values from local storage
        const lastKnownProduct = products[products.length - 1]; // Get the last product in the list
        if (lastKnownProduct) {
            document.getElementById('brand').value = lastKnownProduct.brand;
            document.getElementById('model').value = lastKnownProduct.model;
            document.getElementById('description').value = lastKnownProduct.description;
        } else {
            // Clear the fields if no products are in local storage
            document.getElementById('brand').value = '';
            document.getElementById('model').value = '';
            document.getElementById('description').value = '';
        }
    }
}

document.getElementById('submitBtn').addEventListener('click', function() {
    const pdtNumber = document.getElementById('pdtNumber').value;
    const status = document.getElementById('status').value;
    const remarks = document.getElementById('remarks').value;
    const serial = document.getElementById('serial').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const description = document.getElementById('description').value;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    if (pdtNumber && status && remarks && serial) {
        const dataPdt = { pdtNumber, status, remarks, serial, brand, model, description, date, time };
        let recordsPdt = JSON.parse(localStorage.getItem('recordsPdt')) || [];
        recordsPdt.push(dataPdt);
        localStorage.setItem('recordsPdt', JSON.stringify(recordsPdt));
        document.getElementById('formPdt').reset();
        loaddataPdt(); // Call the correct function to load data
    }
});

function loaddataPdt() {
    const recordsPdt = JSON.parse(localStorage.getItem('recordsPdt')) || [];
    const tablePdtBody = document.getElementById('tablePdt').querySelector('tbody');
    tablePdtBody.innerHTML = '';
    recordsPdt.forEach(record => {
        const row = `<tr>
            <td>${record.pdtNumber}</td>
            <td>${record.status}</td>
            <td>${record.serial}</td>
            <td>${record.brand}</td>
            <td>${record.model}</td>
            <td>${record.description}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.remarks}</td>
        </tr>`;
        tablePdtBody.innerHTML += row;
    });
}

window.onload = function() {
    loaddataPdt(); // Load data on page load
};

// Add event listener for Enter key
document.getElementById('formPdt').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        document.getElementById('submitBtn').click(); // Trigger the submit button click
    }
});

// Auto-submit when pdt is filled
document.getElementById('serial').addEventListener('input', function() {
    const serial = this.value;
    if (serial.length === 14) {
        // If the barcode is valid (14 characters), auto-submit
        document.getElementById('submitBtn').click(); // Trigger the submit button click
    } else if (serial.length > 14) {
        // If the barcode is invalid (more than 14 characters), show an error message
        alert("Barcode is not allowed. Please enter a valid 14-character barcode.");
        this.value = ''; // Clear the input
    }
});

// Export Button
document.getElementById('exportBtn').addEventListener('click', function() {
    const recordsPdt = JSON.parse(localStorage.getItem('recordsPdt')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "PDT Number,Status,Serial,Brand,Model,Description,Date,Time,Remarks\n"; // Added Remarks header
    recordsPdt.forEach(record => {
        const row = `${record.pdtNumber},${record.status},${record.serial},${record.brand},${record.model},${record.description},${record.date},${record.time},${record.remarks || ''}`; // Include remarks
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pdt_checklist.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
});

document.getElementById('clearBtn').addEventListener('click', function() {
    // Prompt the user for the password
    const password = prompt("Please enter the password to proceed:");

    // Define the correct password
    const correctPassword = "P@ssw0rd!@#$";

    // Check if the entered password is correct
    if (password === correctPassword) {
        // Show confirmation dialog
        const confirmation = confirm("Are you sure you want to clear the database?");
        
        // If the user confirmed, clear the local storage
        if (confirmation) {
            localStorage.removeItem('recordsPdt');
            loaddataPdt();
        }
    } else {
        // Show the error modal
        const errorModal = document.getElementById('errorModal');
        errorModal.style.display = "block"; // Show the modal
    }
});

// Close the modal when the user clicks on <span> (x)
document.getElementById('closeErrorModal').addEventListener('click', function() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = "none"; // Hide the modal
});

// Close the modal when the user clicks anywhere outside of the modal
window.addEventListener('click', function(event) {
    const errorModal = document.getElementById('errorModal');
    if (event.target === errorModal) {
        errorModal.style.display = "none"; // Hide the modal
    }
});