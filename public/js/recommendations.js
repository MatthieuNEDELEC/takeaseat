$(document).ready(function(){

    const ul = document.getElementById('conseils');
    const list = document.createDocumentFragment();
    const url = '/getcontact';

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if(data.err){
            Swal.fire({
                title: "Woopsi",
                text: data.err
                });
        }
        else{
            let conseils = data;

            conseils.map(function(conseil) {
                let li = document.createElement('li');
                let date = document.createElement('legend');
                let nom = document.createElement('h2');
                let message = document.createElement('p');
                
                let horaire = new Date(conseil.ts);
                let heure = horaire.getHours().toString().padStart(2, '0');
                let minutes = horaire.getMinutes().toString().padStart(2, '0');
                let jour = horaire.getDate().toString().padStart(2, '0');
                let mois = (horaire.getMonth()+1).toString().padStart(2, '0');
                let annee = horaire.getFullYear();
                
                let heure_msg = "Le "+jour+" / "+mois+" / "+annee+" à "+heure+":"+minutes;

                date.innerHTML = heure_msg;
                nom.innerHTML = `${conseil.nom}`;
                message.innerHTML = `${conseil.message}`;

                li.appendChild(date);
                li.appendChild(nom);
                li.appendChild(message);
                list.prepend(li);
            });
            ul.appendChild(list);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
});