from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify  # requis pour les callbacks JWT

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

# --- GESTIONNAIRES D’ERREUR JWT POUR ÉVITER LES REDIRECTIONS CORS ---

@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    return jsonify({
        "error": "Missing Authorization Header"
    }), 401

@jwt.invalid_token_loader
def custom_invalid_token_callback(reason):
    return jsonify({
        "error": f"Invalid token: {reason}"
    }), 401

@jwt.expired_token_loader
def custom_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "error": "Token has expired"
    }), 401
