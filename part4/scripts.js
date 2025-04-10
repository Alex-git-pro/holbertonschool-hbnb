// Fonction pour récupérer un cookie par son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour récupérer l'ID de la place dans l'URL
function getPlaceIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id'); // Extrait l'ID de la place depuis l'URL
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = loginForm.email.value;
      const password = loginForm.password.value;

      console.log('Tentative de login avec:', email, password);

      try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        console.log('Status de la réponse:', response.status);

        const text = await response.text();
        console.log('Réponse brute:', text);

        if (response.ok) {
          const data = JSON.parse(text);
          console.log('Token reçu :', data.access_token);
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html'; // Redirection vers la page d'accueil après connexion
        } else {
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Erreur JS ou réseau :', error);
      }
    });
  }

  // Vérifie l'authentification et charge les places si nécessaire
  if (document.getElementById('places-list')) {
    checkAuthentication();
  }

  // Récupérer l'ID de la place depuis l'URL et charger les détails de la place
  const placeId = getPlaceIdFromURL(); // Extraction de l'ID de la place
  const token = getCookie('token'); // Vérification du token

  // Vérification si l'utilisateur est authentifié et éviter la redirection infinie
  if (!token && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html'; // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
  } else if (placeId) {
    fetchPlaceDetails(token, placeId); // Récupérer les détails de la place si l'ID est présent
  } else {
    console.error('Place ID est manquant');
    // Gérer le cas où l'ID de la place est manquant
  }
});

// Fonction pour vérifier l'authentification et gérer l'affichage du lien login
function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  console.log('🔍 Token détecté dans index.html :', token);

  if (!loginLink) return;

  if (token) {
    loginLink.style.display = 'none'; // Cacher le lien login si l'utilisateur est authentifié
    fetchPlaces(token);
  } else {
    loginLink.style.display = 'block'; // Afficher le lien login si l'utilisateur n'est pas authentifié
    fetchPlaces();
  }
}

// Fonction pour récupérer les places depuis l'API
async function fetchPlaces(token = null) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://127.0.0.1:5000/api/v1/places', {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Erreur lors du fetch des places');
    }

    const data = await response.json();
    console.log('📦 Places récupérées :', data);

    displayPlaces(data);
  } catch (error) {
    console.error('❌ Erreur fetchPlaces :', error);
  }
}

// Fonction pour récupérer les détails de la place depuis l'API
async function fetchPlaceDetails(token = null, placeId) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Envoie le token si l'utilisateur est authentifié
    }

    const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du fetch des détails de la place : ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Détails de la place récupérés :', data);

    displayPlaceDetails(data); // Appeler la fonction pour afficher les détails de la place
  } catch (error) {
    console.error('Erreur fetchPlaceDetails :', error);
  }
}

// Fonction pour afficher dynamiquement les détails de la place dans le HTML
function displayPlaceDetails(place) {
  const container = document.getElementById('place-details');
  container.innerHTML = ''; // Vide l'existant

  const title = document.createElement('h1');
  title.textContent = place.title;

  const description = document.createElement('p');
  description.innerHTML = `<strong>Description:</strong> ${place.description || 'No description available.'}`;

  const price = document.createElement('p');
  price.innerHTML = `<strong>Price per night:</strong> $${place.price}`;

  const amenitiesList = document.createElement('ul');
  amenitiesList.innerHTML = `<strong>Amenities:</strong>`;
  
  // Vérification si amenities est un tableau avant d'utiliser forEach
  if (Array.isArray(place.amenities) && place.amenities.length > 0) {
    place.amenities.forEach((amenity) => {
      const li = document.createElement('li');
      li.textContent = amenity;
      amenitiesList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No amenities available';
    amenitiesList.appendChild(li);
  }

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(price);
  container.appendChild(amenitiesList);

  // Vérifie si l'utilisateur est authentifié pour afficher le bouton "Add Review"
  const token = getCookie('token');
  const addReviewButton = document.getElementById('add-review-button');
  if (token) {
    addReviewButton.style.display = 'block'; // Affiche le bouton si l'utilisateur est authentifié
  } else {
    addReviewButton.style.display = 'none'; // Cache le bouton si l'utilisateur n'est pas authentifié
  }
}


// Fonction pour afficher dynamiquement les places dans le HTML
function displayPlaces(places) {
  const container = document.getElementById('places-list');
  container.innerHTML = ''; // Vide l'existant

  if (places.length === 0) {
    container.innerHTML = '<p>Aucune place disponible.</p>';
    return;
  }

  places.forEach((place) => {
    const article = document.createElement('article');
    article.classList.add('place-card');
    article.setAttribute('data-price', place.price);

    article.innerHTML = `
      <h2>${place.title}</h2>
      <p>${place.description || ''}</p>
      <p>Price per night: $${place.price}</p>
      <button class="details-button" onclick="window.location.href='place.html?id=${place.id}'">View Details</button>
    `;

    container.appendChild(article);
  });

  document.getElementById('price-filter').addEventListener('change', (event) => {
    const selectedPrice = event.target.value;
    const places = document.querySelectorAll('.place-card');

    places.forEach((place) => {
      const price = parseFloat(place.getAttribute('data-price'));

      if (selectedPrice === 'all') {
        place.style.display = 'block';
      } else if (price <= selectedPrice) {
        place.style.display = 'block';
      } else {
        place.style.display = 'none';
      }
    });
  });
}
