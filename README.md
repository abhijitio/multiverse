# multiverse

Setting Up Database :- 

    CREATE DATABASE universe ;

    CREATE TABLE universetable ( id INTEGER, power INTEGER, family_id VARCHAR, universe_name VARCHAR);

    CREATE INDEX ON universetable (family_id);


      id  | power | family_id | universe_name 
    ------+-------+-----------+---------------
      100 |     1 | f1        | ua
      200 |    -1 | f3        | ua
      300 |    -1 | f1        | ub
      400 |     1 | f3        | ub
      500 |    -1 | f1        | ua
      600 |     1 | f3        | ua
      700 |    -1 | f1        | ub
      800 |     1 | f3        | ub
      900 |     1 | f2        | ub
     1000 |    -1 | f3        | ub
      120 |     1 | f4        | uc


Installation :- 

    Install the Express Generator :

    $ npm install express-generator@4 -g

    Create a new project and install the required dependencies:

    $ express node-multiverse
    $ cd node-multiverse
    $ npm install
    $ npm start

    Install pg-promise

    $ npm install pg-promise@5 --save


    Install Bluebird: (https://pub.clevertech.biz/native-javascript-promises-vs-bluebird-9e58611be22)

    $ npm install bluebird@3 --save


Project Files :- 

    routes/index.js :- It defines the routes

    queries.js :- This file should be in root directory.



    Positive Power = 1
    Negative Power = -1
    Balanced Family = When sum(power) of family members is Zero


APIs :- 

    localhost:3000/api/universe :- POST , to add an entry in the Table
    Params :-
    id, power, family_id, universe_name

    localhost:3000/api/getlist/:universe_name :- GET , list of families of that particular universe.

    localhost:3000/api/check/:family_id :- GET , it returns True / False . To check  if families with same identifiers have same power in all universes.

    localhost:3000/api/unbalanced :- GET , it returns the unbalanced families, where family total power is not zero in each family_id under each universe.
