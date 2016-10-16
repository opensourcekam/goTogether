// // TEMPORARY FOR ALPHA VERSION
//
// var map,
//     lat,
//     lng,
//     poly,
//     geodesicPoly,
//     marker1,
//     marker2
//
// var lc = sessionStorage.getItem('location').replace(/,/g, '+').replace(/\s/g,'')
// console.log(lc)
// function initMap() {
//   var currentPosition = {}
//   var flyingTo = {}
//
//   $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+lc+'&key=AIzaSyC-GOgmWRmDOS6Ir9pNoBpdE_W-uAiHlTM', (json) => {
//       flyingTo.lat = json.results[0].geometry.location.lat
//       flyingTo.lng = json.results[0].geometry.location.lng
//   })
//
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       currentPosition = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       }
//
//       var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 6,
//         center: currentPosition,
//         panControl: false,
//         zoomControl: false,
//         scaleControl: false,
//         disableDefaultUI: true,
//         draggable: false
//       })
//
//       marker1 = new google.maps.Marker({
//         map: map,
//         draggable: true,
//         visible: false,
//         position: currentPosition
//       })
//
//       marker2 = new google.maps.Marker({
//         map: map,
//         draggable: true,
//         visible: false,
//         position: flyingTo
//       })
//
//       var bounds = new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition())
//       map.fitBounds(bounds)
//       geodesicPoly = new google.maps.Polyline({strokeColor: '#CC0099', strokeOpacity: 1.0, strokeWeight: 3, geodesic: true, map: map})
//
//       draw()
//     })
//   }
// }
//
// function draw() {
//   var path = [marker1.getPosition(), marker2.getPosition()]
//   geodesicPoly.setPath(path)
// }
