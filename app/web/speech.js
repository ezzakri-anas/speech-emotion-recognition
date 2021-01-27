

const STOP = document.getElementById("stop");
const RECORD = document.getElementById("record");
const AudioElement = document.getElementById("audio");
const BLINKING_DOT = document.getElementById("blink-dot");
const DROPDOWN = document.getElementById("drop-down");
const UL = document.getElementById("items");
const RECORD_TIMER = document.getElementById("record-time")

const MIN_WIDTH = 750;
const MIN_HEIGHT = 660;


var FOLDER = ".\\web\\sound_samples";
async function get_sound_names(dir_path){
  let sounds = await eel.sound_names(dir_path)();
  for(let sound of sounds){
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "#";
    a.appendChild(document.createTextNode(sound));
    li.appendChild(a);
    li.className = "sound";
    UL.appendChild(li);
  }
}

get_sound_names(FOLDER);

// Manage window size
var resizingTimer;

function sizeThreshold(){
  let width = window.outerWidth < MIN_WIDTH ? MIN_WIDTH : window.outerWidth;
  let height = window.outerHeight < MIN_HEIGHT ? MIN_HEIGHT : window.outerHeight;

  window.resizeTo(width, height);
}

window.addEventListener('resize', (event) => {
  event.preventDefault();
  clearTimeout(resizingTimer);
  resizingTimer = setTimeout(function () {
    sizeThreshold();
  }, 250);
}, false);


DROPDOWN.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.className == "dropdown-item"){
    let sound_name = event.target.innerHTML;
    AudioElement.setAttribute("src", "sound/" + sound_name);
    AudioElement.load();

    endRecording();

    eel.predict_emotion(sound_name)((prediction) => {
      prediction = Array.from(prediction[0]);
      update_chart(prediction);
    });
  }
})


// CHART
const canva = document.getElementById('myChart');
const ctx = canva.getContext('2d');

var chart = new Chart(ctx, {
  type: "bar",
  
  data: {
    labels: [
      "Neutral",
      "Happy",
      "Sad",
      "Angry",
      "Fearfull"
    ],

    datasets: [
      {
        label: "prediction",
        barThickness: "10%",
        backgroundColor: [
          "#5e005b",
          "#444078",
          "#235975",
          "#178d9a",
          "#0cbaba"
        ],
        data: [10, 10, 10, 10, 10],
      },
    ],
  },

  // Configuration options go here
  options: {
    cornerRadius: 20,

    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },

    title: {
      display: false,
      text: "Speech emotion prediction",
    },

    scales: {
      yAxes: [{
        ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
            stepSize: 25,
            fontColor: "#DDDDDD",
            fontSize: 20,
        }
      }],

      xAxes: [{
        barThickness: 100,
        ticks: {
            fontColor: "#F5F5F5",
            fontSize: 15,
        }
      }],
    },

    layout: {
      padding: {
          left: 0,
          right: 0,
          top: 30,
          bottom: 0
      }
    },

    animation: {
      duration: 750,
    }
  },
});

function update_chart(data){
  for (let i=0; i<data.length; i++){
    chart.data["datasets"][0].data[i] = data[i].toFixed(3);
  }
  chart.update();
}

RECORD.addEventListener("click", (event) => {
  event.preventDefault();
  RECORD.disabled = true;
  RECORD.disabled = false;
  if (!RECORDING && !PAUSED){
    startRecording();
  } else if (RECORDING && !PAUSED){
    pauseRecording();
  } else if (RECORDING && PAUSED){
    resumeRecording();
    
  }
});

STOP.addEventListener("click", (event) => {
  event.preventDefault();
  endRecording();
});

var RECORDING = false;
var PAUSED = false;
var dt;
var timeInterval;
var duration = new Date(0);
var PERIOD = 3;

function startRecording(){
  RECORDING = true;
  predictFromVoice();
  runTime();
  RECORD.innerHTML = "Pause";
  RECORD.className = RECORD.className.replace("btn-danger", "btn-outline-danger");
  RECORD_TIMER.innerHTML = "00 : 00";
  BLINKING_DOT.style.display = "inline-block";
  STOP.disabled = false;
  STOP.className = STOP.className.replace("btn-outline-warning", "btn-warning");
  console.log("Started to record");
}

function resumeRecording(){
  RECORDING = true;
  PAUSED = false;
  predictFromVoice();
  runTime();
  RECORD.innerHTML = "Pause";
  BLINKING_DOT.style.animation = "1s blinker ease infinite";
}

function pauseRecording(){
  PAUSED = true;
  clearInterval(timeInterval);
  RECORD.innerHTML = "Resume";
  BLINKING_DOT.style.animation = "none";
}

function endRecording(){
  RECORDING = false;
  PAUSED = false;
  stopTime();
  STOP.disabled = true;
  STOP.className = STOP.className.replace("btn-warning", "btn-outline-warning");
  RECORD.className = RECORD.className.replace("btn-outline-danger", "btn-danger");
  RECORD.innerHTML = "Record";
  BLINKING_DOT.style.display = "none";
}

// async function predictFromVoice(){
//   if (!RECORDING || PAUSED){
//     console.log("gonna shut down");
//     return;
//   }
//   prediction = await eel.record_and_predict(PERIOD)();
//   predictFromVoice();
//   prediction = Array.from(prediction[0]);
//   updateChart(prediction);
// }

async function predictFromVoice(){
  await eel.record_and_predict()();
}

eel.expose(stopPredicting);
function stopPredicting(){ // STOP or not
  return !RECORDING || PAUSED;
}

eel.expose(updateChart);
function updateChart(data_){
  console.log("updating chart");
  chart.data.datasets[0].data = data_;
  chart.update();
}


function runTime(){
  var dt = (new Date()) - duration;
  timeInterval = setInterval(() => {
    duration = (new Date()) - dt;
    duration = new Date(duration);
    var dur_min = formatTime(duration.getMinutes());
    var dur_sec = formatTime(duration.getSeconds());
    RECORD_TIMER.innerHTML = dur_min + " : " + dur_sec;
  }, 500);
}

function stopTime(){
  clearInterval(timeInterval);
  duration = new Date(0);
  RECORD_TIMER.innerHTML = "";
}

function formatTime(t){
  return t < 10 ? "0" + t : t;
}
