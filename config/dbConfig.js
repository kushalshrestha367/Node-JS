module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "nodejs",
    //which data you are using like postgress sqllite
    dialect: "mysql",
    //connection thread response
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };