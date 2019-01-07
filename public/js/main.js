const hostUrl = 'localhost';

var timer = document.getElementById('stopwatch');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var breakBtn = document.getElementById('break');
var watch = new Stopwatch({
    timer: timer
});

// TODO CHANGE THIS SO THAT THE TIMER OBJECT IS HANDLED HERE?
// TODO EXTEND THE STOPWATCH TO MAKE IT PAGE SPECIFIC

/*
    Following functions are private and used to start and stop the stopwatch.
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
        var http = new XMLHttpRequest();
        var url = '/post_time';
        var params = `time=${currTime}`; // TODO: implement user id if you plan to do that later
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                alert(http.responseText);
            }
        }
        http.send(params);
    }
})
