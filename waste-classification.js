// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
// const URL = "https://teachablemachine.withgoogle.com/models/o_QRU9nqg/";
const URL = "./model/"

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(500, 450, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    showPage();

    labelContainer = document.getElementById("label-container");
    organikContainer = document.getElementById("organik");
    anorganikContainer = document.getElementById("anorganik");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        // const classPrediction =
        //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].className == "Organik" &&
            prediction[i].probability > 0.5) {
            labelContainer.innerHTML = prediction[i].className;

            addClass(organikContainer, "card");
            removeClass(anorganikContainer, "card");
        } else if (prediction[i].className == "Anorganik" &&
            prediction[i].probability > 0.5) {

            labelContainer.innerHTML = prediction[i].className;
            addClass(anorganikContainer, "card");
            removeClass(organikContainer, "card");
        }
    }
}

function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "block";
}