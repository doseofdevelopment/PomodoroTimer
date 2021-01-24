function App() {

    const [displayTime, setDisplayTime] = React.useState(25*60);
    const [breakTime, setBreakTime] = React.useState(5*60);
    const [sessionTime, setSessionTime] = React.useState(25*60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(
        new Audio ("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav")
    );
    
    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const toggleTime = () => {
        let sec = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + sec;
        let onBreakVar = onBreak;
        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if(date > nextDate) {
                    setDisplayTime(prev => {
                        if(prev <= 0 && !onBreakVar) {
                            playBreakSound();
                            onBreakVar = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <= 0 && onBreakVar) {
                            playBreakSound();
                            onBreakVar = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += sec;
                }
                
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval)
        }
        if(timerOn) {
            clearInterval(localStorage.getItem('interval-id'));
        }
        setTimerOn(!timerOn)
    };

    const resetTime = () => {
        setDisplayTime(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);
    }

    const changeTime = (changeAmount, type) => {
        if (type === 'break') {
            if (breakTime <= 0 && changeAmount < 0) {
                return;
            }
            setBreakTime((prev) => prev + changeAmount);
        } else {
            if (sessionTime <= 0 && changeAmount < 0) {
                return;
            }
            setSessionTime((prev) => prev + changeAmount);
            if (!timerOn) {
                setDisplayTime(sessionTime + changeAmount);
            }
        }
    }

    const clockify = (time) => {
        let mins = Math.floor(time / 60);
        let secs = time % 60;
        return (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    };


    function Length({ title, changeTime, type, time, clockify, titleID, decID, incID, breakID }) {
        return (
            <div>
                <h3 id={titleID}>{title}</h3>
                <div className="timeSettings">
                    <button className="btn-small blue lighten-1" onClick={() => changeTime(-60, type)} id={decID}>
                        <i className="material-icons">arrow_downward</i>
                    </button>
                    <h3 id={breakID}>{clockify(time)}</h3>
                    <button className="btn-small blue lighten-1" onClick={() => changeTime(60, type)} id={incID}>
                        <i className="material-icons">arrow_upward</i>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="center-align">
            <h1 >Pomodoro Clock</h1>
            <div className="dual-container">
                <Length
                    title={'Break Length'}
                    changeTime={changeTime}
                    type={'break'}
                    time={breakTime}
                    clockify={clockify}
                    titleID="break-label"
                    decID = "break-decrement"
                    incID = "break-increment"
                    breakID = "break-length"
                />
                <Length
                    title={'Session Length'}
                    changeTime={changeTime}
                    type={'session'}
                    time={sessionTime}
                    clockify={clockify}
                    titleID="session-label"
                    decID = "session-decrement"
                    incID = "session-increment"
                    breakID = "session-length"
                />
            </div>
            <h1 id={'time-left'}>{clockify(displayTime)}</h1>
            <h3>{onBreak ? "Break" : "Session"} </h3>
            <button onClick={toggleTime} id={"start_stop"} className="btn-small blue lighten-1">
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ) : (
                        <i className="material-icons">play_circle_filled</i>
                    )}
            </button>
            <button onClick={resetTime} id={'reset'} className="btn-small blue lighten-1">
                <i className="material-icons">autorenew</i>
            </button>
            <p>{'Sound will play when it is time for break'}</p>
        </div>
    );


}

ReactDOM.render(<App />, document.getElementById('output'));