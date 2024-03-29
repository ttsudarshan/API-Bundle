const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async (req, res) => {
    const text = await getTodayEvents();
    res.send(text);
});

async function getTodayEvents() {

    const todayUrl = "https://www.checkiday.com/";
    try {
        // Fetch HTML content of the webpage
        const response = await axios.get(todayUrl);
        // Load HTML content into Cheerio
        const $ = cheerio.load(response.data);
        
        const Holiday = $('.holiday');

        let events = []; 

        Holiday.each((index, holiday) => {
            const $holiday = $(holiday);
            const holidayTitle = $holiday.find('h2').text();
            const holidayDescription = $holiday.find('.mdl-card__supporting-text').text();
            
            let collection = holidayDescription.split('Observed');
            collection[1] = " Observed" + holidayDescription.split('Observed')[1];

            const desc = collection[0] + '.' + collection[1]
               
            const event = {
                holidayTitle,
                holidayDescription: desc.trim(),
            }

            events.push(event);
        })
        
        for(let i = 0; i < events.length; i++){
            
            if(events[i]['holidayDescription'][0] == '.'){
                console.log(events[i]['holidayDescription'][0])
                const strippedText = JSON.stringify(events[i]['holidayDescription']);
                events[i]['holidayDescription'] = strippedText.slice(2,-1).trim();
            }

            events = events.filter(event => event.holidayTitle !== 'On This Day in History');
            
        }

        return events;

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return 'Error fetching or parsing data';
    }
  }
  

module.exports = router;