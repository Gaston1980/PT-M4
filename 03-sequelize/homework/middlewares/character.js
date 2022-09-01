const { Router } = require('express');
const { Op, Character, Role } = require('../db');
const router = Router();

router.post("/", async (req,res) => { // solo "/" xq el path completo se definio en el archivo server.js
    const {code, name, age, race, hp, mana,date_added} = req.body;
    if(!code || !name || !hp || !mana) // consulto solo por los que son campos obligatorios
    return res.status(404).send("Falta enviar datos obligatorios");
    try {
    const newCharacter = await Character.create({code, name, age, race, hp, mana, date_added});
    res.status(201).json(newCharacter); 
    }catch(e) {
    res.status(404).send("Error en alguno de los datos provistos")    
    }
  })

  router.get('/', async (req, res) => { // /character?race=value
    const { race, age } = req.query;

    //Ir a buscar todos los personajes
    //if(race) Ir a buscar todos los personajes que coincidan con esa raza 

    if (!race) {
        const character = await Character.findAll();
        return res.send(character);
    }
    else { 
        if(race && age) {
            const character = await Character.findAll({
                where: { //WHERE race = value
                  race: race,
                  age: age
                },
              });
            res.send(character);
        }
        else if(race) {
            const character = await Character.findAll({
                where: { //WHERE race = value
                  race: race,
                },
              });
            res.send(character);
        }
    }
    
})

// localhost:3000/character/young
router.get('/young', async (req, res) => {
    const characters = await Character.findAll({
        where: {
            age: {
                [Op.lt]: 25    // < 25
            }
        }
    })
    res.send(characters)

})

router.get('/roles/:code', async (req, res) => {
    const { code } = req.params; //abcde

    const character = await Character.findByPk(code, {
        //join 
        include: Role
    })
    res.send(character)
})
  
  
  router.get("/:code", async (req,res) => {
    const {code} = req.params;
    try {
    const characterBycode = await Character.findByPk(code)
    if(characterBycode) return res.json(characterBycode)
    return res.status(404).send(`El código ${code} no corresponde a un personaje existente` )
    }catch (e){
    res.send(e)
    }
    })

    router.put('/addAbilities', async(req, res) => {
        const { codeCharacter, abilities } = req.body;  // [a1, a2, a3]
        //                                                              i
    
        const character = await Character.findByPk(codeCharacter)
        const promises = abilities.map(a => character.createAbility(a)) // [p1, p2, p3]
        await Promise.all(promises)
    
        res.sendStatus(200)
    
    })

    // localhost:3000/character/age?value=40
router.put('/:attribute', async (req, res) => {
    const { attribute } = req.params;
    const { value } = req.query;

    await Character.update({ [attribute]: value }, {
        where: {
            [attribute]: null
        }
    })
    res.send('Personajes actualizados')
})



module.exports = router;