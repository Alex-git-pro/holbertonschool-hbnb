document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          try {
              await loginUser(email, password);
          } catch (error) {
              displayError(error.message || 'Une erreur est survenue lors de la connexion');
          }
      });
  }

  checkAuthentication();

  const placeDetailsSection = document.getElementById('place-details');
  if (placeDetailsSection) {
      const placeId = getPlaceIdFromURL();
      const token = getCookie('token');
      if (placeId) {
          fetchPlaceDetails(token, placeId);
      } else {
          displayError('Aucun ID de lieu spécifié');
      }
  }

  const reviewsSection = document.getElementById('reviews');
  if (reviewsSection) {
      const token = getCookie('token');
      fetchReviews(token);
  }

  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
      priceFilter.innerHTML = '';
      const options = [
          { value: '10', text: '$10' },
          { value: '50', text: '$50' },
          { value: '100', text: '$100' },
          { value: 'all', text: 'Tout' }
      ];
      options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.text;
          priceFilter.appendChild(optionElement);
      });
      priceFilter.value = 'all';
      priceFilter.addEventListener('change', handlePriceFilter);
  }

  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
      reviewForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const token = getCookie('token');
          if (!token) {
              displayError('Vous devez être connecté pour soumettre un avis');
              return;
          }
          const placeId = getPlaceIdFromURL();
          if (!placeId) {
              displayError('Aucun ID de lieu spécifié');
              return;
          }
          const text = document.getElementById('review').value;
          const rating = document.getElementById('rating').value;

          try {
              await submitReview(token, placeId, text, rating);
          } catch (error) {
              displayError(error.message || 'Une erreur est survenue lors de la soumission de l\'avis');
          }
      });
  }
});

async function loginUser(email, password) {
  const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
  });

  if (response.ok) {
      const data = await response.json();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      const cookieString = `token=${data.access_token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      document.cookie = cookieString;
      window.location.href = '/index.html';
  } else {
      alert('Échec de la connexion : ' + response.statusText);
  }
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
          return cookieValue;
      }
  }
  return null;
}

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');
  const addReviewSection = document.getElementById('add-review');

  if (!token) {
      if (loginLink) loginLink.style.display = 'block';
      if (addReviewSection) addReviewSection.style.display = 'none';
  } else {
      if (loginLink) loginLink.style.display = 'none';
      if (addReviewSection) addReviewSection.style.display = 'block';
  }
  fetchPlaces(token);
}


