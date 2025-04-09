fetch('http://127.0.0.1:5000/api/v1/places')
  .then(response => response.json())
  .then(data => {
    // Traiter les données reçues
  })
  .catch(error => console.error('Erreur:', error));
