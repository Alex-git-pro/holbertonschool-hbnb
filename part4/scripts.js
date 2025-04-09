// Fonction pour récupérer un cookie par son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Ajouter un event listener pour le formulaire de login
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page par défaut

      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        // Faire la requête à l'API pour tenter le login
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Envoie des données de connexion
        });

        if (response.ok) {
          // Si le login est réussi, obtenir le token
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`; // Sauvegarder le token dans un cookie

          // Rediriger l'utilisateur vers la page principale
          window.location.href = 'index.html';
        } else {
          // Si le login échoue, afficher un message d'erreur
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Erreur de connexion :', error);
      }
    });
  }
});
