from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

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
logger.debug(f"API Key loaded: {'Yes' if OPENAI_API_KEY else 'No'}")
client = OpenAI(api_key=OPENAI_API_KEY)

def enhance_prompt(user_prompt: str, variation: int = 0) -> str:
    """Enhance the user's prompt with professional photography and jewelry-specific details."""
    base_enhancements = [
        "professional studio photography",
        "high-end jewelry photography",
        "8K resolution",
        "perfect lighting",
        "luxury jewelry display",
        "ultra-realistic",
        "photorealistic",
        "detailed craftsmanship",
        "premium materials",
        "high-end jewelry store quality"
    ]
    
    # Add specific enhancements based on the type of jewelry
    jewelry_type = user_prompt.lower()
    specific_enhancements = []
    
    if "ring" in jewelry_type:
        specific_enhancements.extend([
            "perfect diamond sparkle",
            "precise metal finish",
            "detailed stone setting",
            "professional ring photography"
        ])
    elif "necklace" in jewelry_type:
        specific_enhancements.extend([
            "elegant chain detail",
            "perfect pendant focus",
            "luxury necklace display",
            "professional jewelry photography"
        ])
    elif "earring" in jewelry_type:
        specific_enhancements.extend([
            "detailed earring design",
            "perfect stone arrangement",
            "luxury earring presentation",
            "professional jewelry photography"
        ])
    elif "bracelet" in jewelry_type:
        specific_enhancements.extend([
            "intricate bracelet design",
            "perfect metal work",
            "luxury bracelet display",
            "professional jewelry photography"
        ])
    
    # Add variation-specific enhancements
    variation_enhancements = []
    if variation == 1:
        variation_enhancements.extend([
            "modern minimalist design",
            "contemporary style",
            "clean lines"
        ])
    elif variation == 2:
        variation_enhancements.extend([
            "classic traditional design",
            "timeless elegance",
            "vintage-inspired"
        ])
    elif variation == 3:
        variation_enhancements.extend([
            "avant-garde design",
            "unique artistic style",
            "innovative approach"
        ])
    elif variation == 4:
        variation_enhancements.extend([
            "luxury high-end design",
            "exclusive style",
            "premium finish"
        ])
    
    # Combine all enhancements
    all_enhancements = base_enhancements + specific_enhancements + variation_enhancements
    
    # Create the enhanced prompt
    enhanced_prompt = f"{user_prompt}, {', '.join(all_enhancements)}"
    
    logger.debug(f"Original prompt: {user_prompt}")
    logger.debug(f"Enhanced prompt (variation {variation}): {enhanced_prompt}")
    
    return enhanced_prompt

def generate_single_image(prompt: str, variation: int) -> dict:
    """Generate a single image with the given prompt and variation."""
    enhanced_prompt = enhance_prompt(prompt, variation)

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=enhanced_prompt,
            n=1,
            size="1024x1024",
            quality="hd",
            style="natural",
        )
        image_url = response.data[0].url
        return {
            'success': True,
            'image': image_url,
            'variation': variation
        }
    except Exception as e:
        logger.error(f"OpenAI API Error: {e}")
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate_images():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        logger.debug("Received request to /api/generate")
        data = request.get_json(silent=True)
        logger.debug(f"Request data: {data}")
        
        if data is None:
            logger.error("Invalid JSON payload received")
            return jsonify({
                'success': False,
                'message': 'Invalid JSON payload'
            }), 400

        prompt = data.get('prompt', '')
        logger.debug(f"Prompt received: {prompt}")

        if not prompt:
            logger.error("No prompt provided")
            return jsonify({
                'success': False,
                'message': 'Prompt is required'
            }), 400

        if not OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            return jsonify({
                'success': False,
                'message': 'OpenAI API key not configured'
            }), 500

        # Generate 5 variations of the image
        results = [generate_single_image(prompt, i) for i in range(5)]
        
        # Filter successful results and extract image URLs
        successful_results = [r for r in results if r['success']]
        generated_images = [r['image'] for r in successful_results]
        
        if not generated_images:
            return jsonify({
                'success': False,
                'message': 'Failed to generate any images',
                'errors': [r.get('error') for r in results if not r['success']]
            }), 500

        return jsonify({
            'success': True,
            'prompt': prompt,
            'images': generated_images,
            'message': f'Successfully generated {len(generated_images)} images'
        })

    except Exception as e:
        logger.exception("Error generating images")
        return jsonify({
            'success': False,
            'message': 'Failed to generate images',
            'error': str(e)
        }), 500

@app.route('/api/test', methods=['GET'])
def test_api():
    """Test endpoint to verify OpenAI API key is working."""
    if not OPENAI_API_KEY:
        return jsonify({
            'success': False,
            'message': 'OpenAI API key not configured'
        }), 500
    
    return jsonify({
        'success': True,
        'message': 'OpenAI API key is configured',
        'key_length': len(OPENAI_API_KEY)
    })

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