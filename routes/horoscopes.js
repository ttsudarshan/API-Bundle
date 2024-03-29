const express = require("express");
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

async function getHoroscope(sign) {

  const horoscopeUrl = `https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign=${sign}`;
  try {
      // Fetch HTML content of the webpage
      const response = await axios.get(horoscopeUrl);
      
      // Load HTML content into Cheerio
      const $ = cheerio.load(response.data);
      
      // Find the element with class name "main-horoscope"
      const mainHoroscopeElement = $('.main-horoscope');
      
      // Return the text content of the main-horoscope element
      const horoArr = mainHoroscopeElement.toString().split("-");

      const myHoroscope = {
          sign: (sign >= 1 && sign <= 12) ? 
          ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][sign - 1] : 
          'Invalid Sign Number',
          signNumber: sign,
          date: horoArr[54].split("<strong>")[1].split("<")[0],
          horoscope: horoArr[55].split("<")[0],
      }

      return myHoroscope;
  } catch (error) {
      console.error('Error fetching or parsing data:', error);
      return 'Error fetching or parsing data';
  }
}

router.get("/", async (req, res, next) => {
  let horoscopes = [];
  try {
    for(let i=1; i<= 12; i++){
      const horoscope = await getHoroscope(i);
      horoscopes.push(horoscope);
    }
    res.send(horoscopes);
  } catch (error){ res.status(500).send('Internal Server Error!') }
});

router.get('/:sign', async (req, res) => {
  try {
      const sign = req.params.sign;
      const horoscope = await getHoroscope(sign);
      res.send(horoscope);
  } catch (error) {
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
