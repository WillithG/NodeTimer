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
    con.query(REMOVE_DUMMY_USERS, function(err, result) {
        if (err) {console.log(REMOVE_DUMMY_USERS + err);}
    });
}

function remove_dummy_times(done) {
    const REMOVE_DUMMY_TIMES = `
        DELETE FROM times
        WHERE userid=${DUMMY_ID};
    `;
    con.query(REMOVE_DUMMY_TIMES, function(err, result) {
        if (err) {console.log('REMOVE_DUMMY_TIMES' + err);}
        if (typeof done == 'function') {done()}
    });
}

function insert_time_dummy(time, date){
    if (!date) {
        date = 'CURDATE()';
    }
    insert_q = `
        INSERT INTO times(userid, timeofperiod, dateofperiod, typeofperiod)
        VALUES (${DUMMY_ID}, ${time}, ${date}, 'study');
    `;
    con.query(insert_q, function(err, res) {
        if (err) {console.log('insert_time err: ' + err);}
    });
}

/**
 * Returns true if both of passed arrays have the same values. Assumes passed vales are not objects
 * @param {array} a1 
 * @param {array} a2 
 */
function equal_arrays(a1, a2) {
    if (a1.length != a2.length) {
        return false;
    }
    // compare every value
    for (var i=0; i < a1.length; i++) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

// TODO TEST STUCK HERE 
// TESTS FAILING
describe('get_time_past_week tests', function() {
    /*
    it('zero tests', function(done) {
        var expected = [0,0,0,0,0,0,0];
        var testVal = db.get_time_past_week(DUMMY_ID);
        assert.equal(equal_arrays(expected, testVal), true);
        remove_dummy_times(done);
    });

    it('single normal test', function(done) {
        insert_time_dummy(7, 'CURDATE()');
        var expected1 = [7,0,0,0,0,0,0];
        var test1 = db.get_time_past_week(DUMMY_ID);
        assert.equal(equal_arrays(expected1, test1), true);
        remove_dummy_times(done);
    });
    */
    it('multiple normal test', function(done){
        // push more times
        /*
        for (var i=0; i<7; i++) {
            if (i == 0) {
                insert_time_dummy(7, 'CURDATE()');
            } else {
                insert_time_dummy((7-i), `DATE_ADD(CURDATE(), INTERVAL -${i} DAY)`);
            }
        }
        */

        var expected2 = [7,6,5,4,3,2,1];
        var test2; 
        var cb = function(res) {
            console.log(res);
            test2 = res;
            assert.equal(equal_arrays(expected2, test2), true); 
            //remove_dummy_times(done);
            done();
        }
        db.get_time_past_week(DUMMY_ID, cb);

    });

    it('lorge test', function(){});

    //remove_dummy_times();
    //remove_dummy();
});

