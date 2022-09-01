const { Router } = require('express');
const { Ability } = require('../db');
const router = Router();

router.post('/', async (req, res) => {
    const { name, mana_cost } = req.body;

    if(!name || !mana_cost) return res.status(404).send("Falta enviar datos obligatorios")

    try {
        const ability = await Ability.create(req.body);
        res.status(201).send(ability)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.put('/setCharacter', async (req, res) => {
    const { idAbility, codeCharacter } = req.body;

    const ability = await Ability.findByPk(idAbility);
    //Relaciono una habilidad con un personaje
    await ability.setCharacter(codeCharacter)
    res.send(ability)
})

module.exports = router;