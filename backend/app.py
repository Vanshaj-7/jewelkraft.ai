from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Read OpenAI API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate_images():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json(silent=True)
        if data is None:
            return jsonify({
                'success': False,
                'message': 'Invalid JSON payload'
            }), 400

        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({
                'success': False,
                'message': 'Prompt is required'
            }), 400

        if not OPENAI_API_KEY:
            return jsonify({
                'success': False,
                'message': 'OpenAI API key not configured'
            }), 500

        payload = {
            'model': 'dall-e-3',
            'prompt': prompt,
            'n': 4,
            'size': '1024x1024'
        }
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }

        resp = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers=headers,
            json=payload,
            timeout=30
        )
        resp.raise_for_status()
        data = resp.json()
        generated_images = [item['url'] for item in data.get('data', [])]

        return jsonify({
            'success': True,
            'prompt': prompt,
            'images': generated_images,
            'message': 'Successfully generated images'
        })

    except Exception as e:
        print(f"Error generating images: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to generate images',
            'error': str(e)
        }), 500

@app.route('/api/product_details', methods=['GET'])
def get_product_details():
    # Mock product details
    product_details = {
        'materials': ['Gold', 'Silver', 'Platinum', 'Rose Gold'],
        'sizes': ['Small', 'Medium', 'Large'],
        'karats': [10, 14, 18, 24],
        'colors': ['Yellow', 'White', 'Rose'],
        'hallmarking': ['BIS Hallmark', 'Gold Hallmark', 'Platinum Hallmark'],
        'purity': ['99.9%', '95%', '91.6%'],
        'weight_ranges': ['2-5g', '5-10g', '10-20g', '20g+']
    }
    
    return jsonify(product_details)

if __name__ == '__main__':
    app.run(debug=True, port=5000)