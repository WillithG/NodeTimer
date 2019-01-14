module.exports = {
    convert_input_time_seconds : convert_input_time_seconds,
    
    total_today_JSON_to_formatted : total_today_JSON_to_formatted
}

/*
    Utility file which contains all the methods for time maniupulation in this timer application.
*/

/**
 * Converts string value of the client timer to number of seconds.
 *  Returns int; number of seconds passed by the timer. As int.
 * @param {string} input_time 
 */
// TEST THIS
function convert_input_time_seconds(input_time) {
    // two time format possibilities: 
    // hhh : mm : ss or mm : ss . lll;
    // initialize all time types
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    const hours_to_sec = 3600
    const mins_to_sec = 60;
    var time_as_sec = 0;
    // 1) identify string format, 2) extract data.
    var no_ms_patt = /[0-9]+ : [0-9]{2} : [0-9]{2}/;
    var no_hr_patt = /[0-9]{2} : [0-9]{2} . [0-9]{3}/;
    var is_no_hr_time = no_hr_patt.test(input_time);
    var is_no_ms_time = no_ms_patt.test(input_time);
    var split_time = input_time.split(' ');
    if (is_no_hr_time) {
        // extract data when there are no hours.
        // eg. '01 : 23 : 456' => ["01", ":", "23", ":", "456"]
        minutes = parseInt(split_time[0], 10);
        seconds = parseInt(split_time[2], 10);
    } else if (is_no_ms_time) {
        // eg. '123 : 45 : 67' => ["123", ":", "45", ":", "67"]
        hours = parseInt(split_time[0], 10);
        minutes = parseInt(split_time[2], 10);
        seconds = parseInt(split_time[4], 10);
    }
    total_time = seconds + mins_to_sec * minutes + hours_to_sec * hours;
    return total_time;
}

/**
 * Converts result for total time today, from database, into a display-ready string form
 * Either returns the string form of the time in seconds, minutes + seconds or Minutes + hours
 * @param {JSON} JSON_res 
 */
function total_today_JSON_to_formatted(JSON_res) {
    var total_time = 0;
    var mins_to_sec = 60;
    var hours_to_sec = 3600;
    var hours_to_mins = 60;
    for (var key in JSON_res) {
        total_time += JSON_res[key].timeofperiod;
    }
    // once the total number of seconds has been acquired, convert to the appropriate form

    // TODO clean up this if else block a little bit 
    if (total_time == 0) {
        return 'Fuk all..';
    } else if (total_time < mins_to_sec) {
        return total_time.toString() + ' seconds';
    } else if (total_time < hours_to_sec) {
        var num_mins = Math.floor(total_time / mins_to_sec);
        var num_sec = total_time % 60;
        return `${num_mins} minutes, ${num_sec} seconds`;
    } else {
        var num_hours = Math.floor(total_time / hours_to_sec);
        var num_mins = Math.floor(total_time / mins_to_sec) % hours_to_mins;
        if (num_mins > 0) {
            return `${num_hours} hours, ${num_mins} minutes`;
        } else {
            return `${num_hours} hours`;
        }   
    }
}
