from app import create_app  # importes la fonction pour créer l'app
from app.services import facade

# Crée l'application Flask
app = create_app()

# Crée un utilisateur dans le contexte de l'application
with app.app_context():
    # Données de l'utilisateur
    email = "test@example.com"
    password = "123456"
    first_name = "Test"
    last_name = "User"

    user_data = {
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name
    }

    # Crée un nouvel utilisateur avec les données
    new_user = facade.create_user(user_data)

    print(f"Utilisateur créé : {email} / {first_name} {last_name}")
