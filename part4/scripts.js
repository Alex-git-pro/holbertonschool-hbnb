// Fonction pour récupérer un cookie par son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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
          window.location.href = 'index.html';
        } else {
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Erreur JS ou réseau :', error);
      }
    });
  }

  if (document.getElementById('places-list')) {
    checkAuthentication();
  }
});

// Fonction pour vérifier l'authentification et gérer l'affichage du lien login
function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  console.log('🔍 Token détecté dans index.html :', token);

  if (!loginLink) return;

  if (token) {
    loginLink.style.display = 'none';
    fetchPlaces(token);
  } else {
    loginLink.style.display = 'block';
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
      headers: headers
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

// 🆕 Fonction pour afficher dynamiquement les places dans le HTML
function displayPlaces(places) {
  const container = document.getElementById('places-list');
  container.innerHTML = ''; // Vide l'existant

  if (places.length === 0) {
    container.innerHTML = '<p>Aucune place disponible.</p>';
    return;
  }

  places.forEach(place => {
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
}
