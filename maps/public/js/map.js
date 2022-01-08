const SVNIT = [72.7833, 21.1663];
const LPSavani = [72.78685735866463, 21.19382270200964];
let center = LPSavani;

const userLocation= [];
navigator.geolocation.getCurrentPosition( (position) => {
    userLocation.push(position.coords.longitude);
    userLocation.push(position.coords.latitude);
});

console.log("USER LOCATION - ", userLocation);

//SettingUp Map Box

mapboxgl.accessToken = 'pk.eyJ1IjoicmF2ZW5jbGFhYXciLCJhIjoiY2t5MnF1MDNtMG9hMjJ1bXJ0eXlwOGI3biJ9.pnJpkAKU-pXMEdhXgvgtwQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 15,
    center: center || [72.7933, 21.1959]  //Logitude & Lattitude
    });

//Add controller
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

//Add Search Bar
// Add the control to the map.
map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
})
);

//Add Marker
// const marker = new mapboxgl.Marker({
//     color: "#3e3e3e",
//     draggable: true
//     })
//     .setLngLat(SVNIT)
//     .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("SVNIT"))
//     .addTo(map);

//Enabling GEOLOCATE
const geoLocate = new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
    })

map.addControl(geoLocate);

//Connect With DataBase
async function getStores(){
    let stores = await fetch("/stores", { method: "get" });
    stores = await stores.json();
    console.log(stores);

    for(let i=0; i<stores.length; i++){
        
        if(stores[i].storeId == 0){
            new mapboxgl.Marker({
                color: "#7CFC00",
                // draggable: true
                })
                .setLngLat(stores[i].location.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<a href = "/stores/${stores[i]._id}">BOOK</a>`))
                .addTo(map);
        }

        else{
            new mapboxgl.Marker({
                color: "#FF5733",
                // draggable: true
                })
                .setLngLat(stores[i].location.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<a href = "/stores/${stores[i]._id}">BOOK</a>`))
                .addTo(map);
        }

        }
}

getStores();

const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
    fetch("/map/reset", {
        method: "GET"
    });
    window.location.href = "/map";
})
