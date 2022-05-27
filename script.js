let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let transparentColor = "transparent";

// let filterCont = document.querySelector(".filter-cont");


let recordFlag = false;
let recorder;

let chunks = []; //media data in chunks

let constraints = {
    video: true,
    audio: true
}
// navigator --> global object , browser info

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);    // provide functionality to easily record media

        recorder.addEventListener("start", (e) => {
            chunks = [];
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {

            //conversion of media chunks data to video

            let blob = new Blob(chunks, { type: "video/mp4" });
            let videoUrl = URL.createObjectURL(blob);

            if (db) {
                let videoId = shortid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `vid-${videoId}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }
            // let a = document.createElement("a");
            // a.href = videoUrl;
            // a.download = "stam.mp4";
            // a.click();
        })
    })




recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;
    if (recordFlag) {  //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else {  //stop
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})


captureBtnCont.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");  //provide an object for drawing and manipulating mages
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    //filtering
    tool.fillStyle = transparentColor;    // used to set color to the html element
    tool.fillRect(0, 0, canvas.width, canvas.height); // used to draw a filled rectangle 

    let imageUrl = canvas.toDataURL();

    if (db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageUrl
        }
        imageStore.add(imageEntry);
    }
    // let a = document.createElement("a");
    // a.href = imageUrl;
    // a.download = "image.jpg";
    // a.click();

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)

})





let timerId;
let counter = 0;  // represents total seconds
let timer = document.querySelector(".timer");
function startTimer() {

    timer.style.display = "block";

    function displayTimer() {
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;     //remaining value

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;          //remaining value

        let seconds = totalSeconds;
        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
    counter = 0;
}


// apply filtering 

let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})




