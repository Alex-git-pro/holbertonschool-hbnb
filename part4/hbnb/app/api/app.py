from flask import Flask
from flask_cors import CORS

# Crée l'app Flask
app = Flask(__name__)

# Active CORS pour toutes les routes
CORS(app)

# Exemple de route de test
@app.route('/api/test', methods=['GET'])
def test():
    return { "message": "API is working!" }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
