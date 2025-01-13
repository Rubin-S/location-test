const express = require("express");
const cors = require("cors");  // Import the cors package
const { clients, updateClientLocation } = require("./clients");
const serviceProvider = require("./serviceProvider");
const geolib = require("geolib");

const app = express();
const port = 3000;


// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors({ origin: "http://127.0.0.1:5501" }));


// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get the service provider details
app.get("/api/serviceProvider", (req, res) => {
  res.json(serviceProvider);
});

// Endpoint to update client location and add them to the list
// Make sure the route exists in server.js
app.post("/api/clients", async (req, res) => {
  const { clientName, latitude, longitude } = req.body;
  
  // Update client location logic
  await updateClientLocation(clientName, { latitude, longitude });

  res.status(200).send(`Location updated for ${clientName}`);
});


// Endpoint to get clients within the service radius
app.get("/api/availableClients", (req, res) => {
  const availableClients = clients.filter((client) =>
    isWithinRadius(serviceProvider, client.location)
  );

  res.json(availableClients);
});

// Helper function to calculate distance
function isWithinRadius(serviceProvider, clientLocation) {
  const distance =
    geolib.getDistance(serviceProvider.location, clientLocation) / 1000; // Convert meters to kilometers
  return distance <= serviceProvider.serviceRadiusKm;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
