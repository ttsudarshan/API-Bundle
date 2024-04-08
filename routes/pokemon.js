const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const defaultPokemon = 'bulbasaur';


router.get("/", async (req, res) => {

    try{
        const data = await getPokemons(defaultPokemon);
        res.json(data);
    } catch {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:pokemon', async (req, res) => {
    try {
        const pokemon = (req.params.pokemon).toLocaleLowerCase();
        const data = await getPokemons(pokemon);
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

async function getPokemons(pokemon) {

    const pokemonUrl = `https://pokemondb.net/pokedex/${pokemon}`;
    try {
        const response = await axios.get(pokemonUrl);
        const $ = cheerio.load(response.data);

        const getValues = (elementArr) => {
            let valuesss = []
            for(let i=0; i<elementArr.length; i++){
                valuesss.push($(elementArr[i]).text());
            }
            return valuesss
        }


        const pokemonName = $(($('em'))[0]).text();

        let tbody = $('tbody');
        let tbodyFirst = $($(tbody[0])).children();
        const tbodyFirstData = [
            getValues($(tbodyFirst[0]).children()),
            getValues($(tbodyFirst[1]).children()),
            getValues($(tbodyFirst[2]).children()),
            getValues($(tbodyFirst[3]).children()),
            getValues($(tbodyFirst[4]).children()),
            getValues($(tbodyFirst[5]).children()),
            getValues($(tbodyFirst[6]).children()),
        ]

        let tbodySecond = $($(tbody[1])).children();
        const tbodySecondData = [
            getValues($(tbodySecond[0]).children()),
            getValues($(tbodySecond[1]).children()),
            getValues($(tbodySecond[2]).children()),
            getValues($(tbodySecond[3]).children()),
            getValues($(tbodySecond[4]).children()),
        ]

        let tbodyThird = $($(tbody[2])).children();
        const tbodyThirdData = [
            getValues($(tbodyThird[0]).children()),
            getValues($(tbodyThird[1]).children()),
            getValues($(tbodyThird[2]).children()),
        ]

        let tbodyFourth = $($(tbody[3])).children()
        const tbodyFourthData = [
            getValues($(tbodyFourth[0]).children()),
            getValues($(tbodyFourth[1]).children()),
            getValues($(tbodyFourth[2]).children()),
            getValues($(tbodyFourth[3]).children()),
            getValues($(tbodyFourth[4]).children()),
            getValues($(tbodyFourth[5]).children()),
        ]


        const pokemon = {
            pokedexData : {
                'National Number': tbodyFirstData[0][1],
                'Name': pokemonName,
                'Type': tbodyFirstData[1][1].split(' ').filter(Boolean).map((item, index) => {
                    if (index === 0) {
                        return item.trim(); // Trim the first element
                    }
                    return item;
                }),
                'Species': tbodyFirstData[2][1],
                'Height': tbodyFirstData[3][1],
                'Weight': tbodyFirstData[4][1],
                'Abilities': tbodyFirstData[5][1],
                'Local Number': tbodyFirstData[6][1]
            },
            training : {
                'EV Yield': tbodySecondData[0][1].trim(),
                'Catch Rate': tbodySecondData[1][1].trim(),
                'Base Friendship': tbodySecondData[2][1].trim(),
                'Base Exp': tbodySecondData[3][1],
                'Growth Rate': tbodySecondData[4][1],
            },
            breeding : {
                'Egg Groups': tbodyThirdData[0][1],
                'Gender': tbodyThirdData[1][1],
                'Egg Cycles': tbodyThirdData[2][1].trim(),
            },
            baseStats : {
                'HP': {
                    value: parseInt(tbodyFourthData[0][1]),
                    min: parseInt(tbodyFourthData[0][3]),
                    max: parseInt(tbodyFourthData[0][4]),
                },
                'Attack': {
                    value: parseInt(tbodyFourthData[1][1]),
                    min: parseInt(tbodyFourthData[1][3]),
                    max: parseInt(tbodyFourthData[1][4]),
                },
                'Defence': {
                    value: parseInt(tbodyFourthData[2][1]),
                    min: parseInt(tbodyFourthData[2][3]),
                    max: parseInt(tbodyFourthData[2][4]),
                },
                'Sp. Atk': {
                    value: parseInt(tbodyFourthData[3][1]),
                    min: parseInt(tbodyFourthData[3][3]),
                    max: parseInt(tbodyFourthData[3][4]),
                },
                'Sp. Def': {
                    value: parseInt(tbodyFourthData[4][1]),
                    min: parseInt(tbodyFourthData[4][3]),
                    max: parseInt(tbodyFourthData[4][4]),
                },
                'Speed': {
                    value: parseInt(tbodyFourthData[5][1]),
                    min: parseInt(tbodyFourthData[5][3]),
                    max: parseInt(tbodyFourthData[5][4]),
                },
                'Total': parseInt(tbodyFourthData[0][1]) + parseInt(tbodyFourthData[1][1]) + parseInt(tbodyFourthData[2][1]) + parseInt(tbodyFourthData[3][1]) + parseInt(tbodyFourthData[4][1]) + parseInt(tbodyFourthData[5][1])
            }
        }


        return pokemon;
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return 'Pokemon not found';
    }
}


module.exports = router;