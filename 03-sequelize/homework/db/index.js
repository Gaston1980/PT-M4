const { Sequelize, Op } = require('sequelize');
const modelCharacter = require('./models/Character.js');
const modelAbility = require('./models/Ability.js');
const modelRole = require('./models/Role.js');

const db = new Sequelize('postgres://postgres:Dni27828119@localhost:5432/henry_sequelize', {
  logging: false,
});

modelCharacter(db); //tabla 
modelAbility(db); //tabla
modelRole(db); //tabla


//db.models --> {Character, Ability, Role}

const { Character, Ability, Role } = db.models;

//*:1
Character.hasMany(Ability);
Ability.belongsTo(Character);

//*:*                         //tabla intermedia
Character.belongsToMany(Role, {through: 'Character_Role'})
Role.belongsToMany(Character, {through: 'Character_Role'})



module.exports = {
  ...db.models,
  db,
  Op
}