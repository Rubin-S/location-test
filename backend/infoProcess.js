const { clients, updateClientLocation } = require("./clients");
const geolib = require("geolib");
const serviceProvider = require("./serviceProvider");

function isWithinRadius(serviceProvider, clientLocation) {
  const distance =
    geolib.getDistance(serviceProvider.location, clientLocation) / 1000; // Convert meters to kilometers
  return distance <= serviceProvider.serviceRadiusKm;
}

async function getAvailableClients() {
  // Make sure the clients array is populated before filtering
  await updateClientLocation("Client1"); // Or another client update

  const availableClients = clients
    .filter((client) => isWithinRadius(serviceProvider, client.location))
    .map((client) => client.name);

  console.log("Clients within service radius:", availableClients);
}

getAvailableClients();
