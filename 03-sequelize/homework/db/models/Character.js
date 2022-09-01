const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('Character', {
    code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
      validate: {
        notHenry(value) { // validacion customizada, creo una funcion
          if(value.toLowerCase() === 'henry') {
            throw new Error()
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { // que no sea
        notIn: ["Henry", "SoyHenry", "Soy Henry"]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      get() { // para que se muestre ejem "27 years old"
        const data = this.getDataValue('age')
        return data ? data +  ' years old' : null
      }
    },
    race: {
      type: DataTypes.ENUM('Human', 'Elf', 'Machine', 'Demon', 'Animal', 'Other'),
      defaultValue: 'Other'
    },
    hp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mana: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date_added: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }

  },{timestamps: false})//Impide que se creen las columnas createdAt y updatedAt
}