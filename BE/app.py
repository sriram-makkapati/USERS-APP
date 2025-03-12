from flask import Flask, jsonify
from routes.routes import main_blueprint
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)
CORS(app)

# Swagger configuration
SWAGGER_URL = '/api-documentation'
API_URL = '/static/swagger.yaml' 
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Task Application API" 
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


app.register_blueprint(main_blueprint)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Data Buddy!"})

if __name__ == '__main__':
    app.run(debug=True)