from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
import json
import time

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize Vertex AI
aiplatform.init(
    project=os.getenv('GOOGLE_CLOUD_PROJECT'),
    location=os.getenv('GOOGLE_CLOUD_REGION', 'us-central1'),
)

@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate_images():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({
                'success': False,
                'message': 'Prompt is required'
            }), 400

        # Initialize the Vertex AI model
        model = aiplatform.Model(
            model_name="imagegeneration@001",
            project=os.getenv('GOOGLE_CLOUD_PROJECT'),
            location=os.getenv('GOOGLE_CLOUD_REGION', 'us-central1'),
        )

        instance = {
            "prompt": prompt,
            "number_of_images": 4,
            "image_size": {
                "width": 1024,
                "height": 1024
            }
        }

        # Convert the instance to protobuf Value
        instance_value = json_format.Parse(
            json.dumps(instance),
            Value()
        )

        # Generate images
        response = model.predict([instance_value])
        
        # Extract image URLs from response
        generated_images = []
        for prediction in response.predictions:
            image_data = json.loads(prediction)
            if 'images' in image_data:
                generated_images.extend(image_data['images'])

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