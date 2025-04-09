import os
from datetime import timedelta  # ← nécessaire pour config JWT

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    DEBUG = False

    ADMIN_EMAIL = 'admin@hbnb.io'
    ADMIN_PASSWORD = 'admin1234'
    ADMIN_FIRST_NAME = 'Admin'
    ADMIN_LAST_NAME = 'HBnB'
    ADMIN_ID = '36c9050e-ddd3-4c3b-9731-9f487208bbc1'

    INITIAL_AMENITIES = ['WiFi', 'Swimming Pool', 'Air Conditioning']

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ✅ Config JWT pour éviter les redirections
    JWT_SECRET_KEY = 'super_jwt_secret_key'  # tu peux garder la même que SECRET_KEY si tu veux
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_COOKIE_CSRF_PROTECT = False  # désactive CSRF côté client
