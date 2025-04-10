from flask import Flask
from flask_cors import CORS  # Importer CORS
from app import create_app

app = create_app()
CORS(app)  # Ajouter CORS à l'application Flask

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
