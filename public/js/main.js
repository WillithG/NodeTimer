const hostUrl = 'localhost';

var timer = document.getElementById('stopwatch');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var breakBtn = document.getElementById('break');
var watch = new Stopwatch({
    timer: timer
});

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

toggleBtn.addEventListener('click', function() {
    (!watch.isOn) ? start() : stop();
});

// if the timer is stopped and the reset button has been pressed, reset the timer.
resetBtn.addEventListener('click', function() {
    if (!watch.isOn) { 
        watch.reset();
    }
})

breakBtn.addEventListener('click', function() {
    // if the watch is not on
    // then send a post request to submit_time with the formatted time.
    if(!watch.isOn) {
        var currTime = watch.getTimeFormatted();
        // CODE RED HARD CODED USER ID (CHANGE THIS WHEN U STOP BEING LAZY)
        var userid = 1;
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
});

/*
    Method which returns the current timer type:
    Returns either 'study' or 'break'
*/
var get_time_type = function() { 
    // TODO un-hardcode this
    // make the return value based on what the content of the break is
    return 'study';
}

