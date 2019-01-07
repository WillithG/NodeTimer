var mysql = require('mysql');
module.exports = {
    post_time: post_time
};

var con =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studystopwatch'
});

/* Private: wrapper function for executing an SQL query, and outputting a success message.
    Throws error if the query is not sucessful.
   inputs:
    query :: string; the query to be executed
    succ_msg :: string; the string to be output to console if the query is successful. 
*/
// DOES NOT RETURN FROM WITHIN CON.QUERY
var execute_query = function(query, succ_msg) {
    con.query(query, function (err, result) {
    if (err) {
        console.log(err);
    }
    else {
        if (succ_msg) {
            console.log(succ_msg);
        }
    }
  });
}


/*
    Public: used to submit times to push a new study time to the database
    inputs:
      id :: string; name of user to associate the time with
      time :: int; the time in number of milliseconds
      type :: string; the type of time to be pushed, either 'break' or 'study'
    output: bool; success of query
*/
function post_time(id, time, type) {
    // validate the input
    var id_valid = valid_userid(id);
    var time_valid = valid_time(time);
    var type_valid = type == 'break' || type == 'study';
    // execute query
    query = `
    INSERT INTO times (userid, timeofperiod, dateofperiod, typeofperiod)
    VALUES (${id}, ${time}, CURDATE(), '${type}');
    `;
    var succ = execute_query(query, `time ${id}, ${time} inserted`);
    return succ;
}

/*
    Returns true if passed user id is a valid id
    id :: int; the id to be checked
    Returns: Bool
*/
valid_userid = function(id) {
    // TODO complete 
    return true;
}

/*
    Returns true if passed time is valid
    time :: int; time to be validated
    Returns Bool
*/
valid_time = function(time) {
    // TODO complete
    return true;
}

/* Private: Sanitize the input provided by the client
   inputs:  
   refer to this https://flaviocopes.com/express-sanitize-input/
   https://expressjs.com/en/advanced/best-practice-security.html
*/
// no need for sanitization at this time, because all user inputs are integers.
