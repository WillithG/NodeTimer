const PATH_TO_DB = '../db/database.js';
var db = require(PATH_TO_DB);
var assert = require('assert');
var mysql = require('mysql');
const DUMMY_ID = 1; // userid for dummy user

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studystopwatch'
});

// helper function for setting up dummy user
// helper function for destroying dummy user
function construct_dummy() {
    // change this to check if the user exists first of all
    const CHECK_DUMMY_EXISTS_QUERY = `
    SELECT * 
    FROM users
    WHERE userid=${DUMMY_ID};
    `;
    var dummy_exists = false;
    con.query(CHECK_DUMMY_EXISTS_QUERY, function(err, result) {
        if (err) {console.log('check_dummy_exists error: ' + err);}
        else {
            if (result == {}) {dummy_exists = false;} 
            else {dummy_exists = true;}
        }
    });

    if (!dummy_exists){
        const CREATE_DUMMY_QUERY = `
            INSERT INTO users 
            (userid) 
            VALUES (${DUMMY_ID});
        `;
        
        con.query(CREATE_DUMMY_QUERY, function(err, result) {
            if (err) {console.log('construct_dummy failure: ' + err);}
        });
    }
}

function remove_dummy() {
    const REMOVE_DUMMY_USERS = `
        DELETE FROM users
        WHERE userid=${DUMMY_ID};
    `;
    con.query(q, function(err, result) {
        if (err) {console.log(REMOVE_DUMMY_USERS + err);}
    });
}

function remove_dummy_times() {
    const REMOVE_DUMMY_TIMES = `
        DELETE FROM times
        WHERE userid=${DUMMY_ID};
    `;
    con.query(q, function(err, result) {
        if (err) {console.log(REMOVE_DUMMY_TIMES + err);}
    });
}

function insert_time_dummy(time, date){
    if (!date) {
        date = 'CURDATE()';
    }
    insert_q = `
        INSERT INTO times(userid, timeofperiod, dateofperiod, typeofperiod)
        VALUES (${DUMMY_ID}, ${time}, ${date}, 'study'});
    `;
    con.query(insert_q, function(err, res) {
        if (err) {console.log('insert_time err: ' + err);}
    });
}

// TODO TEST STUCK HERE 
// TESTS FAILING
describe('get_time_past_week tests', function() {

    it('zero tests', function() {
        construct_dummy();
        assert.equal([0,0,0,0,0,0,0], db.get_time_past_week(DUMMY_ID));
        remove_dummy_times();
        remove_dummy();
    });

    it('normal tests', function() {
        construct_dummy();

        insert_time_dummy(7);
        assert.equal([0,0,0,0,0,0,7], db.get_time_past_week(DUMMY_ID));
        
        for (var i=0; i<6; i++) {
            insert_time_dummy((6-i), `DATE_ADD(CURDATE(), INTERVAL -${i} DAY);`);
        }

        assert.equal([1,2,3,4,5,6,7], db.get_time_past_week(DUMMY_ID));

        remove_dummy_times();
        remove_dummy();
    });

    it('lorge test', function(){});
});

