const hostUrl = 'localhost';

var timer = document.getElementById('stopwatch');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var watch = new Stopwatch({
    timer: timer
});
// TODO CODE RED ALERT GET RID OF THIS HARDCODE
var userid = 1;

/*
    On document load, request the values for the main page stats:
        - Total time studied today
*/
window.onload = function() {
    // request the total time studied today
    var http = new XMLHttpRequest();
    var url = '/get_time_today';
    var params = `userid=${userid}`;
    http.open('GET', url+'?'+params, true);
    // update content of total time today to the result of the response.
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var res = http.responseText;
            var newText = res ? res : 0 // if undefined is returned, display 0 instead
            document.getElementById('totalTodayTime').textContent = newText;
        }
    }
    http.send(params);
 };

/*
    Following functions 4 are private and used to start and stop the stopwatch.
*/
function start() {
    toggleBtn.textContent = 'Stop';
    watch.start();
}

function stop() {
    toggleBtn.textContent = 'Start';
    watch.stop();
}

// function to call when you want to toggle the stopwatch
function startStop() {
    (!watch.isOn) ? start() : stop();
}

toggleBtn.addEventListener('click', startStop);

/* 
    Procedure when the reset button is hit. Reset the timer, if it has been stopped. 
    If the submit button has been checked then submit the time to the user's record.
*/
function onReset() {
    // if the watch is not on
    // then send a post request to submit_time with the formatted time.
    var checkbox = document.getElementById('submitCheckBox');
    // todo remove the double check
    if (!watch.isOn) {
        watch.reset();
    }
    if(!watch.isOn && checkbox.checked) {
        var currTime = watch.getTimeFormatted();
        // TODO CODE RED HARD CODED USER ID (CHANGE THIS WHEN U STOP BEING LAZY)
        var time_type = get_time_type();
        var http = new XMLHttpRequest();
        var url = '/post_time';
        var params = `userid=${userid}&time=${currTime}&type=${time_type}`;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                // TODO change this to update the calendar object 
                // also update state of the break button
                alert(http.responseText);
            } else if (http.readyState == 4 && http.status == 400) {
                alert(http.status);
            }
        }
        http.send(params);
    }
};

// if the timer is stopped and the reset button has been pressed, reset the timer.
resetBtn.addEventListener('click', onReset);

// bind the spacebar to start and stop the timer
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 32) { 
        // space
        startStop();
    } else if (e.keyCode == 13) {
        // enter
        onReset();
    } else if (e.keyCode == 83) {
        // s key
        var submitCheckBox = document.getElementById('submitCheckBox');
        submitCheckBox.checked = !submitCheckBox.checked;
    }
})

/*
    Method which returns the current timer type:
    Returns either 'study' or 'break'
*/
var get_time_type = function() { 
    // TODO un-hardcode this
    // make the return value based on what the content of the break is
    return 'study';
}

