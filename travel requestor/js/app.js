// Sample users (admin and employee) for login
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "employee", password: "emp123", role: "employee" }
];

// Login functionality
function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.role === "admin") {
            window.location.href = "admindashboard.html";
        } else {
            window.location.href = "employeerequestform.html";
        }
    } else {
        alert("Invalid credentials");
    }
}

// Employee - Submit travel request
if (document.getElementById('requestForm')) {
    document.getElementById('requestForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const destination = document.getElementById('destination').value;
        const priority = document.getElementById('priority').value;
        const empid = document.getElementById('empid').value;
        const empname = document.getElementById('empname').value;
        const project = document.getElementById('project').value;
        const cause = document.getElementById('cause').value;
        const source = document.getElementById('priority').value;
        const fromdate = document.getElementById('from-date').value;
        const todate = document.getElementById('to-date').value;



        let requests = JSON.parse(localStorage.getItem("requests")) || [];
        
        const idExists = requests.some(request => request.empid === empid);

        if (idExists) {
            alert("ID already exists. Please use a unique ID.");
        } else {
            // If unique, add the new request and store it in localStorage
            requests.push({
                empid, empname, project, cause, source,
                destination, fromdate, todate, priority,
                status: "pending"
            });
            localStorage.setItem("requests", JSON.stringify(requests));

            // Optionally, you could redirect or reset the form after submission
            alert("Request submitted successfully.");
            document.getElementById('requestForm').reset();
        }
    });
}

// Employee - Display travel requests with edit option
// Employee - Display travel requests with edit option in a table format
// Employee - Display travel requests with edit option and view details link
function displayRequests() {
    const requestsList = document.getElementById('requestsList');
    const filterPriority = document.getElementById('filterPriority').value;
    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    // Filter requests based on the selected filter option
    const filteredRequests = requests.filter(req => {
        if (filterPriority === "all") return true;  // Show all requests
        if (filterPriority === "critical") return req.priority === "critical";
        if (filterPriority === "normal") return req.priority === "normal";
        if (filterPriority === "rejected") return req.status === "rejected";
    });

    // Generate HTML for the table
    requestsList.innerHTML = `
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
                        <td><span id="priority-${index}">${req.priority}</span></td>
                        <td>${req.status}</td>
                        <td>
                            <button onclick="editPriority(${index})">Edit Priority</button>
                            <div id="editForm-${index}" style="display:none;">
                                <select id="prioritySelect-${index}">
                                    <option value="normal" ${req.priority === "normal" ? "selected" : ""}>Normal</option>
                                    <option value="critical" ${req.priority === "critical" ? "selected" : ""}>Critical</option>
                                </select>
                                <button onclick="savePriority(${index})">Save</button>
                                <button onclick="cancelEdit(${index})">Cancel</button>
                            </div>
                        </td>
                        <td>
                            <a href="requestDetails.html?index=${index}">View Details</a>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


// Edit Priority Function
function editPriority(index) {
    const editForm = document.getElementById(`editForm-${index}`);
    const prioritySpan = document.getElementById(`priority-${index}`);
    editForm.style.display = 'block';
    prioritySpan.style.display = 'none';  // Hide the priority text when editing
}

// Save Edited Priority
function savePriority(index) {
    const newPriority = document.getElementById(`prioritySelect-${index}`).value;
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    
    // Update the priority of the specific request
    requests[index].priority = newPriority;
    requests[index].status = "pending";


    // Save the updated requests back to localStorage
    localStorage.setItem("requests", JSON.stringify(requests));

    // Refresh the display
    displayRequests();
}

// Cancel Edit
function cancelEdit(index) {
    // Hide the edit form and show the priority text
    const editForm = document.getElementById(`editForm-${index}`);
    const prioritySpan = document.getElementById(`priority-${index}`);
    editForm.style.display = 'none';
    prioritySpan.style.display = 'inline'; // Show the priority text again
}



// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// Initial display on load
if (document.getElementById('requestsList')) {
    displayRequests();
}
