$(document).ready(function(){

    const currentMarkers = [];
    const url = '/getplaces';
    
    const mapContainer = document.getElementById('map-container');

    var beerIcon = L.icon({
        iconUrl: '/media/img/beer.svg',
    
        iconSize:     [40, 52],
        iconAnchor:   [20, 52]
    });
    

    const map = L.map(mapContainer).setView([47.4760,-0.560], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((parsedResult) => {
        if(parsedResult.err){
            Swal.fire({
                title: "Vraiment désolé, j'ai aussi soif que toi mais je ne parviens vraiment pas à retrouver les bars... 😭",
                text: parsedResult.err
                });
        }
        else{
            setResultList(parsedResult);
        }
    })
    .catch(function(error) {
        console.log(error);
    });


    function setResultList(parsedResult) {
        for (const marker of currentMarkers) {
            map.removeLayer(marker);
        }
        for (const result of parsedResult) {

            const pp_link = new URL("https://maps.google.com/?q="+result.nom+", "+result.ville);

            const position = new L.LatLng(result.lat, result.lon);
            currentMarkers.push(new L.marker(position, {icon: beerIcon}).addTo(map).bindPopup('<a href='+pp_link+' target="_blank">'+result.nom+'</a><br><p>'+result.nb_r+'/'+ result.nb_t +'</p>').on('click', clickZoom));
        }
    }

    function clickZoom(e) {
        map.flyTo(e.target.getLatLng());
    }
});