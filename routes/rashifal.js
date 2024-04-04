const express = require("express");
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

String.prototype.textFormatter = function () {
    return (this.toLowerCase())[0].toUpperCase() + this.slice(1);
}

async function getRasifal(frequency, sign) {
    const rasifalUrl = `https://www.hamropatro.com/rashifal/${frequency}/${sign}`;

    try {
        const response = await axios.get(rasifalUrl);

        const $ = cheerio.load(response.data);

        const rasifalElement = $('.desc');
        const rashifalContent = $(rasifalElement).find('p').text();

        const dateEelement = $('.articleTitleNew');
        const dateContent = $(dateEelement).find('a').text();

        let rasifal = []

        const sliceEnd = frequency === "daily" ? 4 :
            frequency === "weekly" ? 5 :
            frequency === "yearly" ? 3 : 2;

        const data = {
            date: dateContent.split(' ').slice(0, sliceEnd).join(' '),
            frequency: frequency.textFormatter(),
            rashi: sign.textFormatter(),
            rashifal: rashifalContent,
        }

        rasifal.push(data);

        return data;

    } catch (error) { res.status(500).send('Internal Server Error!') }
}

router.get('/:frequency', async (req, res) => {
    const frequency = req.params.frequency.toLocaleLowerCase();
    const signs = ['Mesh', 'Brish', 'Mithun', 'Karkat', 'Singha', 'Kanya', 'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbha', 'Meen'];
    let rasifals = [];
    try {
        for(let sign of signs) {
            const rasifal = await getRasifal(frequency, sign);
            rasifals.push(rasifal);
        }
        res.send(rasifals);
    } catch (error) {
        res.status(500).send('Internal Server Error!');
    }
});

router.get('/:frequency/:sign', async (req, res) => {

    const frequency = req.params.frequency.toLocaleLowerCase();
    const sign = req.params.sign.toLocaleLowerCase();
    const data = await getRasifal(frequency, sign);

    let rashifal = [];
    rashifal.push(data);

    res.json(rashifal);

});

module.exports = router;