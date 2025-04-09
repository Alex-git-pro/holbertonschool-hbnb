from app import create_app  # Assure-toi que create_app est bien importé depuis app/__init__.py

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
