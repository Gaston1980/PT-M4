const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('Ability', {
    name: {
      type: DataTypes.STRING,
      unique: "index",
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT
    },
    mana_cost: {
      type: DataTypes.FLOAT,
      unique: "index",
      allowNull: false,
      validate: {
        min: 10.0,
        max: 250.0
      }
    },
    summary: {
      type: DataTypes.VIRTUAL, //esta columna NO se crea en la DB
       get() { // con este medoto logramos que se muestre
         return `${this.name} (${this.mana_cost} points of mana) - Description: ${this.description}`
       }
      }
  })
}