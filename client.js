// clients.js

const clients = [];

async function getClientLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      return reject(
        "Geolocation is not supported by this device or environment."
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(`Failed to fetch location: ${error.message}`),
      { enableHighAccuracy: true }
    );
  });
}

async function updateClientLocation(clientName) {
  try {
    const location = await getClientLocation();
    clients.push({ name: clientName, location });
    console.log(`${clientName}'s location updated successfully:`, location);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { clients, updateClientLocation };
