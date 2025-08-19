# StreamHub - Live TV & Radio Aggregator MVP

A modern web application for streaming live TV and radio channels from around the world, built with Flask backend and vanilla JavaScript frontend.

## 🚀 Features

### ✅ Implemented Features
- **Channel Aggregation**: 11,140+ channels from global IPTV sources
- **Live Streaming**: HLS.js powered video player with autoplay
- **Smart Navigation**: Browse by Live TV, Categories, Countries, Languages, and Radio
- **Advanced Search**: Real-time search across channel names and categories
- **Filtering System**: Filter by category, country, and language
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional UI**: Modern gradient design with smooth animations

### 📺 Channel Categories
- Animation, Auto, Business, Classic, Comedy, Cooking, Culture
- Documentary, Education, Entertainment, Family, General, Kids
- Legislative, Lifestyle, Movies, Music, News, Outdoor, and more

### 🌍 Global Coverage
- **179+ Countries**: Channels from around the world
- **29+ Categories**: Diverse content types
- **Multiple Languages**: English, French, Spanish, and more

## 🛠 Technical Stack

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **SQLAlchemy**: Database ORM (optional)
- **JSON**: Lightweight data storage

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality
- **HLS.js**: HTTP Live Streaming support
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

### Architecture
```
tv-aggregator-backend/
├── src/
│   ├── main.py              # Flask application entry point
│   ├── channels.json        # Parsed channel data
│   ├── routes/
│   │   ├── channels.py      # Channel API endpoints
│   │   └── user.py          # User management (template)
│   ├── models/
│   │   └── user.py          # Database models
│   └── static/              # Frontend files
│       ├── index.html       # Main HTML file
│       ├── styles.css       # CSS styling
│       └── script.js        # JavaScript functionality
├── venv/                    # Python virtual environment
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip (Python package manager)

### Installation

1. **Navigate to project directory**
   ```bash
   cd tv-aggregator-backend
   ```

2. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies** (already installed)
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   python src/main.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📡 API Endpoints

### Channels API
- `GET /api/channels` - Get all channels with optional filtering
  - Query parameters: `category`, `country`, `language`, `search`
- `GET /api/channels/categories` - Get all available categories
- `GET /api/channels/countries` - Get all available countries
- `GET /api/channels/languages` - Get all available languages
- `GET /api/channels/<id>` - Get specific channel by index

### Example API Calls
```bash
# Get all channels
curl http://localhost:5000/api/channels

# Search for news channels
curl http://localhost:5000/api/channels?search=news

# Filter by category
curl http://localhost:5000/api/channels?category=News

# Get categories
curl http://localhost:5000/api/channels/categories
```

## 🎯 Usage Guide

### Navigation
- **Live TV**: Browse all non-radio channels
- **Categories**: Filter channels by content type
- **Countries**: Browse channels by country of origin
- **Languages**: Filter by broadcast language
- **Radio**: Browse radio and audio channels

### Search & Filter
1. Use the search bar to find specific channels
2. Apply category, country, or language filters
3. Combine search with filters for precise results

### Watching Channels
1. Click on any channel card
2. Video player modal opens automatically
3. Stream starts playing (if source is available)
4. Use fullscreen button for immersive viewing
5. Click X or press Escape to close player

## 🔧 Configuration

### Channel Data Source
The application uses the IPTV-org playlist:
```
https://iptv-org.github.io/iptv/index.category.m3u
```

### Customization
- **Styling**: Modify `src/static/styles.css`
- **Functionality**: Update `src/static/script.js`
- **API**: Extend `src/routes/channels.py`

## 🚀 Deployment Options

### Local Development
Already configured for local development with Flask dev server.

### Production Deployment
For production deployment, consider:
1. **Heroku**: Easy deployment with git integration
2. **DigitalOcean**: VPS hosting with more control
3. **AWS/GCP**: Cloud platforms with scaling options
4. **Vercel/Netlify**: For static frontend (requires API separation)

### Environment Variables
For production, set:
```bash
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
```

## 🎨 Design Features

### Visual Design
- **Gradient Backgrounds**: Purple to blue gradient theme
- **Card-based Layout**: Clean channel presentation
- **Hover Effects**: Interactive feedback on all elements
- **Responsive Grid**: Adapts to screen size automatically

### User Experience
- **Fast Loading**: Optimized channel loading with pagination
- **Smooth Animations**: CSS transitions for better UX
- **Error Handling**: Graceful fallbacks for broken streams
- **Accessibility**: Keyboard navigation and screen reader support

## 🔍 Technical Details

### HLS Streaming
- Uses HLS.js library for cross-browser compatibility
- Supports adaptive bitrate streaming
- Automatic quality adjustment based on connection
- Fallback to native HLS for Safari

### Performance Optimizations
- **Lazy Loading**: Channels loaded in batches of 24
- **Image Optimization**: Fallback placeholders for missing logos
- **Debounced Search**: Prevents excessive API calls
- **Efficient Filtering**: Client-side filtering for better performance

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **HLS Support**: Native and JavaScript-based playback

## 🐛 Known Limitations

1. **Stream Availability**: Some channels may be geo-blocked or offline
2. **CORS Issues**: Some streams may not work due to CORS policies
3. **Mobile Autoplay**: Limited by browser autoplay policies
4. **No User Accounts**: Authentication system not implemented (as requested)

## 🔮 Future Enhancements

### Potential Features
- **Favorites System**: Save preferred channels locally
- **Recently Watched**: Track viewing history
- **Channel Recommendations**: AI-powered suggestions
- **EPG Integration**: Electronic Program Guide
- **Multi-language UI**: Interface localization
- **Chromecast Support**: Cast to TV devices
- **Offline Mode**: Download for offline viewing

### Technical Improvements
- **Database Integration**: PostgreSQL for better performance
- **Caching Layer**: Redis for faster API responses
- **CDN Integration**: Global content delivery
- **Analytics**: User behavior tracking
- **Admin Panel**: Channel management interface

## 📄 License

This project is for educational and demonstration purposes. Please respect the terms of service of the IPTV sources and ensure compliance with local broadcasting regulations.

## 🤝 Contributing

This is an MVP demonstration project. For production use, consider:
1. Implementing proper error handling
2. Adding comprehensive testing
3. Setting up CI/CD pipelines
4. Adding monitoring and logging
5. Implementing security best practices

## 📞 Support

For technical questions or issues:
1. Check the browser console for errors
2. Verify network connectivity
3. Ensure the Flask server is running
4. Check if the IPTV source is accessible

---

**Built with ❤️ for global entertainment access**

