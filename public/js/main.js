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
        - update week chart
*/
window.onload = function() {
    get_update_total_time_today();
    update_week_chart();
 };

 /**
  * Requests the total time studied today for the current user. If a response is recieved, the total time today widget is updated.
  */
function get_update_total_time_today() {
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
    http.send();
}

// TODO DOCUMENT
function update_week_chart() {
    var http = new XMLHttpRequest();
    var url = '/get_week_data';
    var params = `userid=${userid}`;
    http.open('GET', url+'?'+params, true);
    //update chart on response
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var hourArray = JSON.parse(http.responseText).reverse();
            console.log(hourArray);

            var ctx = document.getElementById('wkChart').getContext('2d');
           // Charts.default.global.maintainAspectRatio = false;
            var week_line_chart = new Chart(
                ctx, {
                    type: 'line',
                    data: {
                        labels: ['today', 'yesterday', '3 days ago', '4 days ago', '5 days ago', '6 days ago', '7 days ago'].reverse(),
                        datasets: [{
                            label: 'Hours Studied Last 7 days',
                            borderColor: '#f41de2',
                            backgroundColor: '#ffe6ff',
                            data: hourArray
                        }],
                    },
                    options: {
                        responsive: true,
                        scales : {
                            yAxes : [{
                                ticks: {
                                    suggestedMax : (Math.max(...hourArray) + 0.3),
                                    suggestedMin : (Math.min(...hourArray) - 0.3)
                                }
                            }]
                        }
                    }   
                }
            );
        }
    };
    http.send();
}

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
    if(!watch.isOn && checkbox.checked) {
        var currTime = watch.getTimeFormatted();
        var time_type = get_time_type();
        var http = new XMLHttpRequest();
        var url = '/post_time';
        var params = `userid=${userid}&time=${currTime}&type=${time_type}`;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                // if posted successfully then update the total time today widget.
                // also update the chart
                // perhaps make a separate update protocol function
                get_update_total_time_today();
                update_week_chart(); // maybe add a parameter to turn animation on or off.
            } else if (http.readyState == 4 && http.status == 400) {
                alert(http.status);
            }
        }
        http.send(params);
    }
    if (!watch.isOn) {
        watch.reset();
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

