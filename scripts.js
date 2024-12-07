  <script>
    let currentUser = null;

    window.onload = function () {
      const storedUserId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");

      if (storedUserId && storedUserName) {
        currentUser = storedUserId;
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("main-section").classList.remove("hidden");
        document.getElementById("userName").textContent = storedUserName;

        // Load user data
        loadUserData(storedUserId);
      }
    };





    function login() {
      const userId = document.getElementById("userId").value;
      const password = document.getElementById("password").value;

      google.script.run.withSuccessHandler((response) => {
        if (response.success) {
          currentUser = userId;
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", response.name);

          document.getElementById("login-section").classList.add("hidden");
          document.getElementById("main-section").classList.remove("hidden");
          document.getElementById("userName").textContent = response.name;

          // Load user data
          loadUserData(userId);
        } else {
          alert("Invalid User ID or Password");
        }
      }).validateLogin(userId, password);
    }


function loadUserData(userId) {
  google.script.run.withSuccessHandler((response) => {
    if (!response.success) {
      document.getElementById("example").innerHTML = `<p>${response.message}</p>`;
      return;
    }

    const data = response.data;
    if (data.length === 0) {
      document.getElementById("example").innerHTML = "<p>No matching data found.</p>";
      return;
    }

    let table = "<table>";
    const headerRow = data[0]; // Fetch the first row as the header
    table += "<thead><tr>";

    // Dynamically create headers
    headerRow.forEach((header) => {
      table += `<th>${header}</th>`;
    });

    table += "</tr></thead>";
    table += "<tbody>";

    // Populate the data rows
    data.slice(1).forEach((row, index) => {
      const bgColor = index % 2 === 0 ? "#f9f9f9" : "#e9e9e9";
      table += `<tr style="background-color: ${bgColor};">`;
      row.forEach((cell, colIndex) => {
        if (colIndex === 0) { // Assuming Nazim Code is in Column E (index 4)
          table += `<td><a href="#" onclick="fetchEmpData('${cell}')">${cell}</a></td>`;
        } else {
          table += `<td>${cell}</td>`;
        }
      });
      table += "</tr>";
    });

    table += "</tbody></table>";
    document.getElementById("example").innerHTML = table;
  }).getUserData(userId);
}



function fetchEmpData(branchCode) {
  google.script.run.withSuccessHandler((response) => {
    const empDataDiv = document.createElement("div");
    empDataDiv.id = "emp-data";

    if (!response.success) {
      empDataDiv.innerHTML = `<p>${response.message}</p>`;
    } else {
      const data = response.data;

      let table = "<table>";
      const headerRow = data[0]; // Fetch the first row as the header
      table += "<thead><tr>";

      // Dynamically create headers
      headerRow.forEach((header) => {
        table += `<th>${header}</th>`;
      });

      table += "</tr></thead>";
      table += "<tbody>";

      // Populate the data rows
      data.slice(1).forEach((row, index) => {
        const bgColor = index % 2 === 0 ? "#f9f9f9" : "#e9e9e9";
        table += `<tr style="background-color: ${bgColor};">`;
        row.forEach((cell) => {
          table += `<td>${cell}</td>`;
        });
        table += "</tr>";
      });

      table += "</tbody></table>";
      empDataDiv.innerHTML = table;
    }

    // Display the emp data
    document.body.appendChild(empDataDiv);
  }).getEmpData(branchCode); // Pass branchCode to Apps Script
}





    function logout() {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      currentUser = null;

      document.getElementById("main-section").classList.add("hidden");
      document.getElementById("login-section").classList.remove("hidden");
      document.getElementById("userId").value = "";
      document.getElementById("password").value = "";
    }

    function showChangePassword() {
      document.getElementById("change-password-section").classList.remove("hidden");
    }

    function changePassword() {
      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long!");
        return;
      }

      google.script.run.withSuccessHandler((message) => {
        alert(message);
        if (message === "Password changed successfully!") {
          document.getElementById("change-password-section").classList.add("hidden");
        }
      }).changePassword(currentUser, oldPassword, newPassword);
    }

    function togglePassword(fieldId) {
      const field = document.getElementById(fieldId);
      const type = field.type === "password" ? "text" : "password";
      field.type = type;
    }


function clearData() {
    // Clear the content of the div
    document.getElementById('emp-data').innerHTML = '';
}

 
    // Function to download table as .xlsx file
    function downloadTableAsExcel() {
      // Get the table element inside the #example div
      const table = document.querySelector("#example table");

      // Check if table exists
      if (!table) {
        alert("No data available to download!");
        return;
      }

      // Convert the table to a worksheet using SheetJS
      const worksheet = XLSX.utils.table_to_sheet(table);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");

      // Generate and download the Excel file
      XLSX.writeFile(workbook, "User_Data.xlsx");
    }

    // Other functions like login, loadUserData, etc.
  </script>
