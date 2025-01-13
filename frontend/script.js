document.addEventListener("DOMContentLoaded", () => {
  const providerName = document.getElementById("provider-name");
  const providerLocation = document.getElementById("provider-location");
  const providerRadius = document.getElementById("provider-radius");
  const updateLocationBtn = document.getElementById("update-location-btn");
  const clientList = document.getElementById("client-list");

  // Fetch service provider details from the backend
fetch("http://localhost:3000/api/serviceProvider")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    providerName.textContent = `Name: ${data.name}`;
    providerLocation.textContent = `Location: (${data.location.latitude}, ${data.location.longitude})`;
    providerRadius.textContent = `Service Radius: ${data.serviceRadiusKm} km`;
  })
  .catch((error) => {
    console.error("Error fetching provider data:", error);
  });


  updateLocationBtn.addEventListener("click", async () => {
    // Get the current geolocation of the client
    if (!navigator || !navigator.geolocation) {
      alert("Geolocation is not supported by this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const clientLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Example client name, this could be dynamic based on user input
        const clientName = "Client1";

        // Update the client location by calling the backend API
        await updateClientLocation(clientName, clientLocation);
        renderClients();
      },
      (error) => {
        alert(`Failed to fetch location: ${error.message}`);
      }
    );
  });

  // Send the client location to the backend
  async function updateClientLocation(clientName, clientLocation) {
    const response = await fetch("http://localhost:3000/api/clients", {
      // Updated to point to the backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, ...clientLocation }),
    });

    if (response.ok) {
      console.log(`${clientName}'s location updated.`);
    } else {
      console.error("Failed to update client location.");
    }
  }

  // Render clients within the service radius
  async function renderClients() {
    const response = await fetch("http://localhost:3000/api/availableClients"); // Updated to point to the backend
    const availableClients = await response.json();

    clientList.innerHTML = ""; // Clear current list

    if (availableClients.length === 0) {
      clientList.innerHTML = "<p>No clients within service radius.</p>";
    } else {
      availableClients.forEach((client) => {
        const clientDiv = document.createElement("div");
        clientDiv.classList.add("client-item");
        clientDiv.textContent = `Client: ${client.name}`;
        clientList.appendChild(clientDiv);
      });
    }
  }
});
