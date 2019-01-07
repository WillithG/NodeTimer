var timer = document.getElementById('stopwatch');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var watch = new Stopwatch({
    timer: timer
});

// TODO CHANGE THIS SO THAT THE TIMER OBJECT IS HANDLED HERE?
// TODO EXTEND THE STOPWATCH TO MAKE IT PAGE SPECIFIC

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

resetBtn.addEventListener('click', function() {
    if (!watch.isOn) { 
        watch.reset();
    }
})
