function Stopwatch(opts) {
    // if you do not prepend with this., then the variable becomes private to the class
    var time = 0;
    var interval;
    var offset;
    this.isOn = false;
    var timer = opts.timer;

    function update() {
        if (this.isOn) {
            time += delta();
        }
        var formattedTime = timeFormatter(time);
        timer.textContent = formattedTime;
        document.title = formattedTime;
    }

    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }

    function timeFormatter(timeInMilliseconds) {
        var time = new Date(timeInMilliseconds);
        var hours = Math.floor(timeInMilliseconds/(1000*60*60)).toString();
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        var milli = time.getMilliseconds().toString();

        if (hours.length < 2) {
            hours = '0' + hours; 
        }
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        if (seconds.length < 2) {
            seconds = '0' + seconds;
        }
        while (milli.length < 3) {
            milli = '0' + milli;
        }

        toReturn = ''
        if (hours != '00') {
            toReturn = hours + " : " + minutes +  " : " + seconds;
        } else {
            toReturn = minutes + ' : ' + seconds + " . " + milli;
        }
        return toReturn
    }

    this.start = function() {
        if (this.isOn) {
            return null;
        }
        // bind this to update, becaues setInterval changes 'this' into the window instance, within the scope of update ()
        interval = setInterval(update.bind(this), 1);
        offset = Date.now();
        this.isOn = true;
    };
    
    
    this.stop = function() {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
        }
    };

    this.reset = function() {
        time = 0;
        timer.textContent = '00 : 00 : 00';
        // TODO get rid of hard-code
        document.title = 'Study Stopwatch';
    };

    
    this.laps = function() {};
}