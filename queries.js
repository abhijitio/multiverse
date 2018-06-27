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
  createUniverse: createUniverse,
  getBalanced: getBalanced
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
    db.any("SELECT f.* FROM  ( SELECT family_id FROM  ( SELECT family_id, universe_name, sum(power) AS total_power FROM   universetable GROUP  BY family_id, universe_name ) sub GROUP  BY 1 HAVING min(total_power) <> max(total_power)) sg JOIN universetable f USING (family_id)")
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


function getBalanced(req, res, next) {
    db.any("with universetable(id, power, family_id, universe_name) as (select * from universetable as x(id, power, family_id, universe_name) ), sub_per_group as (select family_id, universe_name, sum(power) tot_per_grp from universetable group by family_id, universe_name), sub_calc as ( select family_id, max(tot_per_grp) as max, json_agg( json_build_object('universe_name',universe_name, 'tot_per_grp',tot_per_grp)) as grps_tot from sub_per_group group by family_id having count(distinct tot_per_grp)!=1) select f.id,f.family_id, case when rn=1 then (power+(coalesce(max,0)- coalesce((select (v->>'tot_per_grp')::int from json_array_elements(grps_tot) as v where (v->>'universe_name')::text =f.universe_name),0)))else power end, f.universe_name from sub_calc sc right join (select row_number() over(partition by family_id,universe_name) as rn, universetable.* from universetable) f on f.family_id=sc.family_id and f.rn=1 order by family_id,universe_name")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Make and Get balanced families'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



