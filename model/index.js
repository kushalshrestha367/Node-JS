const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

// la sequelize yo config haru lag ani database connect gardey vaneko hae 
//     class      instance      
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port : 3306,
  //postgress : 5432 

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
//method
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};
 // key
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files to create a data base on phymyadmin 
// db.blogs = require("./blogModel.js")(sequelize, DataTypes);  controller ma j banako ya connect garne
db.users = require("./userModel.js")(sequelize, DataTypes);
db.questions = require("./questionModel.js")(sequelize, DataTypes);
db.answers = require("./answerModel.js")(sequelize, DataTypes);

//reference question kun manxe le gareko tyo chai chaiyo hai need foreign key userid ko kei unique kura hold garna
//kunai pani users ko multiple question huncha    //foreing key bancha database mah
db.users.hasMany(db.questions) 
db.questions.belongsTo(db.users)

//question to answer  ..foreign key
db.questions.hasMany(db.answers)
db.answers.belongsTo(db.questions)

db.users.hasMany(db.answers)
db.answers.belongsTo(db.users)

//migrate
db.sequelize.sync({ force: false  }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;