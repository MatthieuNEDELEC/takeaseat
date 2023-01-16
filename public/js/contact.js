$(document).ready(function(){

	form.onsubmit = async (e) => {
		e.preventDefault();

		Swal.fire({
			title: "Top !",
			text: "Ton message est en cours d'envoi..."
            });

		$.ajax({
            type: 'POST',
            url: "/postcom",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
            data:  $("#form").serialize(),
			success: function(msg, status, jqXHR){
				if(msg.err == null && msg.success == true){
					Swal.fire(
						"C'est Good !", "Merci pour ton message !",
						'success'
					);
					document.getElementById("nom").value = "";
					document.getElementById("msg").value = "";
				}
				else if(msg.err != null)
				Swal.fire(
					'Aïe Aïe Aïe...',
					msg.err,
					'error'
				);
				else if(msg.err == null && msg.success == false){
					//swal("", "error");
					Swal.fire(
						'Aïe Aïe Aïe...',
						"Woops impossible d'établir une connexion à la base de données, réessaye dans quelques instants...",
						'error'
					);
				}
				else{
					Swal.fire(
						'Aïe Aïe Aïe...',
						"Un erreur inconnue est survenue.",
						'error'
					);
				}
			},
		});
	};
});