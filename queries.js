var promise = require('bluebird');

var options = {

  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'universe',
    user: 'abhijit',
    password: 'abhijit'
});

// add query functions

module.exports = {
  getFamilyStatus: getFamilyStatus,
  getUnbalancedFamily: getUnbalancedFamily,
  getUniverseFamily: getUniverseFamily,
  createUniverse: createUniverse
};


function createUniverse(req, res, next) {
  req.body.id = parseInt(req.body.id);
  req.body.power = req.body.power;
  req.body.family_id = req.body.family_id;
  req.body.universe_name = req.body.universe_name;
  db.none('INSERT INTO universetable(id, power, family_id, universe_name)' +
      'VALUES(${id}, ${power}, ${family_id}, ${universe_name})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one record'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getUniverseFamily(req, res, next) {
  var universeName = req.params.universe_name;
  db.any('SELECT * FROM universetable WHERE universe_name=$1', universeName)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get list of all entries per universe'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getFamilyStatus(req, res, next) {
  var familyID = req.params.family_id;
  console.log(familyID);
  db.any("SELECT count(DISTINCT total_power) = 1 FROM  ( SELECT sum(power) AS total_power FROM universetable WHERE  family_id = $1 GROUP  BY universe_name) sub", familyID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Check Status True/False'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getUnbalancedFamily(req, res, next) {
  db.any("SELECT f.* FROM universetable f JOIN (SELECT family_id, universe_name FROM universetable GROUP BY family_id, universe_name HAVING sum(power) != 0) as t ON t.family_id = f.family_id AND t.universe_name = f.universe_name")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get Unbalanced families'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



