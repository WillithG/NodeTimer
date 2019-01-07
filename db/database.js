var mysql = require('mysql');

var con =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'timesdb'
});

/* Private: wrapper function for executing an SQL query, and outputting a success message.
    Throws error if the query is not sucessful.
   inputs:
    query :: string; the query to be executed
    succ_msg :: string; the string to be output to console if the query is successful. 
*/
var execute_query = function(query, succ_msg) {
    con.query(query, function (err, result) {
    if (err) throw err;
    if (succ_msg) {
         console.log(succ_msg);
    }
  });
}

/*
    Public: used to submit times to push a new study time to the database
    inputs:
      id :: string; name of user to associate the time with
      time :: int; the time in number of milliseconds
*/

/* Private: Sanitize the input provided by the client
   inputs: 
*/
