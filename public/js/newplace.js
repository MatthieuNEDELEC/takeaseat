$(document).ready(function(){

    const searchInput = document.getElementById('search-field');
    const nbInput = document.getElementById('nb-field');
    const searchButton = document.getElementById('search-button');
    const nbButton = document.getElementById('nb-button');
    const resultList = document.getElementById('result-list');
    const mapContainer = document.getElementById('map-container');

    searchInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    nbInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            nbButton.click();
        }
    });

    const currentMarkers = [];
    
    const map = L.map(mapContainer).setView([47.4760,-0.560], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if(query.trim()!=="")
            fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&namedetails=1&limit=4&city=Angers&county=Maine+et+Loire&state=Pays+de+la+Loire&country=France&countrycodes=fr&street=' + query)
                .then(result => result.json())
                .then(parsedResult => {
                    if(parsedResult.length==0)
                        Swal.fire({
                            title: "Oops !",
                            text: "Aucune adresse trouvée pour ta recherche"
                        });
                    else
                        setResultList(parsedResult);
                })
                .catch(function(error) {
                    Swal.fire({
                        title: "Oops !",
                        text: "Erreur lors de la recherche"
                    });
                });
        else{
            Swal.fire({
                title: "Oops !",
                text: "Recherche incorrecte"
            });
        }
    });
    
    function setResultList(parsedResult) {
        $(document.getElementById('nb')).fadeOut('fast');
        resultList.innerHTML = "";
        for (const marker of currentMarkers) {
            map.removeLayer(marker);
        }
        for (const result of parsedResult) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'list-group-item-action');
            li.databar = result;
            const bartitle = document.createElement('h1');
            const barstreet = document.createElement('p');
            const barcity = document.createElement('p');

            bartitle.innerHTML = result.namedetails.name;
            barstreet.innerHTML = result.address.road+", "+result.address.quarter;
            barcity.innerHTML = result.address.city+", "+result.address.county+", "+result.address.country;
            li.appendChild(bartitle);
            li.appendChild(barstreet);
            li.appendChild(barcity);

            li.addEventListener('click', (event) => {
                for(const child of resultList.children) {
                    child.classList.remove('active');
                }

                event.currentTarget.classList.add('active');
                const clickedbar = event.currentTarget.databar;
                const position = new L.LatLng(clickedbar.lat, clickedbar.lon);
                map.flyTo(position, 18);
                
                $(document.getElementById('nb')).fadeIn('fast');
            })
            const position = new L.LatLng(result.lat, result.lon);
            currentMarkers.push(new L.marker(position, {icon: beerIcon}).addTo(map));
            resultList.appendChild(li);
        }
        
        map.flyTo([47.4760,-0.560], 13);
    }

    var beerIcon = L.icon({
        iconUrl: '/media/img/beer.svg',
    
        iconSize:     [40, 52],
        iconAnchor:   [20, 52]
    });
    
    document.getElementById("nb-button").addEventListener("click", function(e) {
		e.preventDefault();

		Swal.fire({
			title: "Top !",
			text: "Le bar est en cours d'ajout..."
            });
        
        const bar = document.getElementsByClassName("active")[0];

        var bardata = new Object();

        bardata.nom = bar.databar.namedetails.name;
        bardata.rue = bar.databar.address.road;
        bardata.quartier = bar.databar.address.quarter;
        bardata.ville = bar.databar.address.city;
        bardata.cp = bar.databar.address.postcode;
        bardata.departement = bar.databar.address.county;
        bardata.region = bar.databar.address.state;
        bardata.pays = bar.databar.address.country;
        bardata.lat = bar.databar.lat;
        bardata.lon = bar.databar.lon;
        bardata.nb_t = nbInput.value;


		$.ajax({
            type: 'POST',
            url: "/addplace",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(bardata),
			success: function(msg, status, jqXHR){
				if(msg.err == null && msg.success == true){
					Swal.fire(
						"C'est Good !", "Ton établissement a été ajouté !",
						'success'
					);
					nbInput.value = "";
				}
				else if(msg.err != null)
				Swal.fire(
					"Impossible d'ajouter le bar",
					msg.err,
					'error'
				);
				else if(msg.err == null && msg.success == false){
					//swal("", "error");
					Swal.fire(
                        "Impossible d'ajouter le bar",
						"Impossible d'ajouter le bar... Réessaye dans quelques instants ou insulte le webmaster !",
						'error'
					);
				}
				else{
					Swal.fire(
                        "Impossible d'ajouter le bar",
						"Une erreur inconnue est suvenue, là c'est la hesse, merci de nous avertir ^^",
						'error'
					);
				}
			},
		});
	});
});