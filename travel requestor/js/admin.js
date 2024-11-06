function displayAdminRequests() {
    const adminRequestsList = document.getElementById('adminRequestsList');
    const filterStatus = document.getElementById('filterStatus').value; // Get the selected filter value
    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    // Filter requests based on selected status
    const filteredRequests = filterStatus === 'all' ? requests : requests.filter(req => req.status === filterStatus);

    // Generate HTML for the table with action dropdown
    adminRequestsList.innerHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Emp Name</th>
                    <th>Destination</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${filteredRequests.map((req, index) => `
                    <tr id="request-${index}">
                        <td>${req.empname}</td>
                        <td>${req.destination}</td>
                        <td>${req.priority}</td>
                        <td>${req.status}</td>
                        <td>
                            <select onchange="updateRequestStatus(${requests.indexOf(req)}, this.value)">
                                <option value="approved" ${req.status === "approved" ? "selected" : ""}>Approve</option>
                                <option value="rejected" ${req.status === "rejected" ? "selected" : ""}>Reject</option>
                                <option value="on hold" ${req.status === "on hold" ? "selected" : ""}>Hold</option>
                            </select>
                        </td>
                        <td>
                            <a href="requestDetails.html?index=${requests.indexOf(req)}">View Details</a>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


// Function to update the status of a request when a selection is made
function updateRequestStatus(index, status) {
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    if (requests[index] && status) {
        requests[index].status = status;
        localStorage.setItem("requests", JSON.stringify(requests));
        displayAdminRequests(); // Re-render the requests table after updating the status
    }
}

// Function to handle the filter change
function handleFilterChange() {
    displayAdminRequests(); // Re-render the table with the updated filter
}

// Call to render the requests initially
displayAdminRequests();

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
