module.exports = {
    validate_time : validate_time,
    validate_userid : validate_userid,
    validate_time_type : validate_time_type
}

/*
    User input validation utility file.
*/

// TODO DOCUMENT, AND UPDATE THESE VALIDATION FUNCTIONS:
function validate_time(time) {
    if (time == '00 : 00 . 000') {
      return false;
    }
    return true;
}

function validate_userid(userid) {
    return userid != undefined;
}

function validate_time_type(time_type) {
    return time_type == 'study' || time_type == 'break';
}

