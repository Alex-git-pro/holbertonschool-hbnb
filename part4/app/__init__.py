from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from app.api.v1.users import api as users_ns
from app.api.v1.amenities import api as amenities_ns
from app.api.v1.places import api as places_ns
from app.api.v1.reviews import api as reviews_ns
from app.api.v1.auth import api as auth_ns
from app.extensions import bcrypt, jwt, db
from app.database import init_db, seed_db

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ✅ CORS configuré correctement pour l'API + JWT
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5500"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])

    # ✅ Swagger JWT Authorization
    authorizations = {
        'Bearer': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
    }

    # ✅ Initialisation de Swagger avec l’auth
    api = Api(
        app,
        version='1.0',
        title='HBnB API',
        description='HBnB Application API',
        authorizations=authorizations,
        security='Bearer'  # facultatif, mais pratique pour tout activer
    )

    # Initialisation des extensions Flask
    bcrypt.init_app(app=app)
    jwt.init_app(app=app)
    db.init_app(app)

    # Init/seed de la BDD
    with app.app_context():
        init_db()
        seed_db()

    # Ajout des namespaces API
    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')

    return app
