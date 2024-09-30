// Import necessary modules
    // Import express from the 'express' package (used for creating a web server)
import express from 'express';
    // Import bodyParser from the 'body-parser' package (used to parse incoming request bodies)
import bodyParser from 'body-parser';
    // Import axios from the 'axios' package (used to make HTTP requests to external APIs)
import axios from 'axios';
    // Import path from the 'path' package (used for file path manipulations)
import path from 'path';
    // Import fileURLToPath from the 'url' package (used to work with file paths in ES modules)
import { fileURLToPath } from 'url';

// Define __filename as the full file path using fileURLToPath()
const __filename = fileURLToPath(import.meta.url);
// Define __dirname as the directory name using path.dirname()
const __dirname = path.dirname(__filename);

// Create an instance of the express application
// Define the port number as 3000 to run the server
const app = express();
const port = 3000; 

// Use bodyParser to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Set the app to serve static files from the public directory
app.use(express.static('public'));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Routes

// Home route to render the form for user input (desired location)
    // .get request handler for the home route ('/') to render the form page
app.get('/', (req, res) => 
{
  res.render('index');
});

// Route to handle form submission and get weather data from OpenWeatherMap API
    // Make a GET request to the weather forecast API, passing the location, API key, and unit type 
app.post('/forecast', async (req, res) => 
{
    const location = req.body.location;
    const apiKey = 'f57af225b57463209002532bcb78e054'; 
    console.log('Using API Key:', apiKey);
    console.log('Location submitted:', location);

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, 
        {
            params: 
            {
                q: location,
                appid: apiKey,
                units: 'imperial',
            }
        });

//  Extract the weather data for 24 hours ahead (8 time intervals of 3 hours)
        const forecastData = response.data.list[8];
//  Check if it will rain or snow and assign appropriate values
        const rain = forecastData.rain ? `${forecastData.rain['3h']} mm` : 'No rain';
        const snow = forecastData.snow ? `${forecastData.snow['3h']} mm` : 'No snow';
// Extract the wind speed in miles per hour
        const windSpeedMph = forecastData.wind.speed;

        // Render the 'result' page and pass the weather data
        res.render('result', 
        {
            rain: rain,
            snow: snow,
            windSpeedMph: windSpeedMph
        });

    
});

// Start the server
app.listen(port, () => 
{
  console.log(`Server is running on http://localhost:${port}`);
});

