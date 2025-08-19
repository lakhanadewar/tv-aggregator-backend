import json
import os
from flask import Blueprint, jsonify, request

channels_bp = Blueprint('channels', __name__)

# Load channels data
def load_channels():
    channels_file = os.path.join(os.path.dirname(__file__), '..', 'channels.json')
    with open(channels_file, 'r', encoding='utf-8') as f:
        return json.load(f)

@channels_bp.route('/channels', methods=['GET'])
def get_channels():
    """Get all channels with optional filtering"""
    try:
        channels = load_channels()
        
        # Get query parameters for filtering
        category = request.args.get('category')
        country = request.args.get('country')
        language = request.args.get('language')
        search = request.args.get('search')
        
        # Filter channels based on query parameters
        filtered_channels = channels
        
        if category:
            filtered_channels = [ch for ch in filtered_channels if ch['category'].lower() == category.lower()]
        
        if country:
            filtered_channels = [ch for ch in filtered_channels if ch['country'].lower() == country.lower()]
        
        if language:
            filtered_channels = [ch for ch in filtered_channels if ch['language'].lower() == language.lower()]
        
        if search:
            search_lower = search.lower()
            filtered_channels = [ch for ch in filtered_channels if search_lower in ch['name'].lower()]
        
        return jsonify({
            'success': True,
            'channels': filtered_channels,
            'total': len(filtered_channels)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@channels_bp.route('/channels/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        channels = load_channels()
        categories = list(set(ch['category'] for ch in channels if ch['category']))
        categories.sort()
        
        return jsonify({
            'success': True,
            'categories': categories
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@channels_bp.route('/channels/countries', methods=['GET'])
def get_countries():
    """Get all unique countries"""
    try:
        channels = load_channels()
        countries = list(set(ch['country'] for ch in channels if ch['country']))
        countries.sort()
        
        return jsonify({
            'success': True,
            'countries': countries
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@channels_bp.route('/channels/languages', methods=['GET'])
def get_languages():
    """Get all unique languages"""
    try:
        channels = load_channels()
        languages = list(set(ch['language'] for ch in channels if ch['language']))
        languages.sort()
        
        return jsonify({
            'success': True,
            'languages': languages
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@channels_bp.route('/channels/<channel_id>', methods=['GET'])
def get_channel(channel_id):
    """Get a specific channel by ID (index)"""
    try:
        channels = load_channels()
        channel_index = int(channel_id)
        
        if 0 <= channel_index < len(channels):
            return jsonify({
                'success': True,
                'channel': channels[channel_index]
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Channel not found'
            }), 404
    except (ValueError, IndexError) as e:
        return jsonify({
            'success': False,
            'error': 'Invalid channel ID'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

