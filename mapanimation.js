// --------------------- MAIN SCRIPT ---------------------

//make the map
mapboxgl.accessToken = "pk.eyJ1Ijoid2FsZWVkYWxyYXdpIiwiYSI6ImNsMjNuOGU3eTFzMDEzYm4zbGNrbHNyZG8ifQ.Lvdiwc4j-Ij_WazuGHLJVA";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-71.104081, 42.365554],
    zoom: 12,
});

getRoutes();

//The array of markers - used in run()
let markers = [];

//ID to store run() operation loop timeout - use to stop running when needed.
let timerID = null;

// --------------------- HELPER FUNCTIONS ---------------------

// Function to Request bus data from SFMTA through 511 open API
// https://511.org/open-data/transit
async function getBusLocations(route = 1) {

    const url = `https://api-v3.mbta.com/vehicles?filter[route]=${route}&include=trip`;
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  }


// Function that populates the route select element with the routes.
async function getRoutes(){
  const url = "https://api-v3.mbta.com/routes"
  const response = await fetch(url);
  const json = await response.json();
  
  json.data.forEach((route)=>{

    let option = document.createElement("option");
    option.value = route.id;
    option.textContent = route.id;
    
    document.getElementById("routes").appendChild(option);
  });

}

// Main loop function
async function run() {

    // get bus data for selected route
    const route = document.getElementById("routes").value;
    console.log(route);
    const locations = await getBusLocations(route);
    console.log(new Date());
    console.log(locations);

    //remove old markers from the map and get rid of the variables
    markers.forEach((marker) => {
      marker.remove();
    });
    markers = [];

    // //filter the data for the target bus route
    // const target_locations = locations.filter(
    //   (bus) => bus.MonitoredVehicleJourney.LineRef === target_route
    // );

    // //add a new marker for each bus
    // target_locations.forEach((bus) => {
    //   // prettier-ignore
    //   const longitude = bus.MonitoredVehicleJourney.VehicleLocation.Longitude;
    //   const latitude = bus.MonitoredVehicleJourney.VehicleLocation.Latitude;
    //   markers.push(
    //     new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)
    //   );
    // });

    locations.forEach((bus) => {
      markers.push(
        new mapboxgl.Marker()
          .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
          .addTo(map)
      );
    });

    // //update the timestamp for the user
    // const timeStamp = locations[0].RecordedAtTime;
    // document.getElementById(
    //   "timeStamp"
    // ).innerHTML = `Last Update: <br> ${new Date(timeStamp)}`;

    // timer
    timerID = setTimeout(run, 15000);
}

// --------------------- BUTTON FUNCTIONS ---------------------
function stop() {
    clearTimeout(timerID);
    //cleartimeout again after a few seconds in case the first time occured
    //after the run function already began executing
    //(as it was awaiting), and thus it only "cleared" the already running
    //instance
    setTimeout(() => {
      clearTimeout(timerID);
    }, 1000);

     //remove old markers from the map and get rid of the variables
     markers.forEach((marker) => {
      marker.remove();
    });
    markers = [];
}

function restart() {
    stop();
    setTimeout(run, 1200);
}


// --------------------- TO DO's ---------------------

// Implement bus line selector:
// Do 1 query to start.
// Go through the data and extract all the unique bus lines.
// Write code to insert that many options tags into the select tag
// Add event listener to select tag. On selection run a function that sets the value of the bus line variable to be the value of that selection,

// Make a new div that show which line is being displayed that updates when witch each new stamp, “now showing: “