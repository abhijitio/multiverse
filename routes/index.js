var express = require('express');
var router = express.Router();

var db = require('../queries');


router.post('/api/universe', db.createUniverse);
router.get('/api/check/:family_id', db.getFamilyStatus);
router.get('/api/unbalanced', db.getUnbalancedFamily);
router.get('/api/getlist/:universe_name', db.getUniverseFamily);



module.exports = router;
