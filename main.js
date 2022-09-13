const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
let computedStyle = getComputedStyle(document.body);

let computedWidth = Number(computedStyle.width.slice(0, computedStyle.width.length - 2));
let computedHeight = Number(computedStyle.height.slice(0, computedStyle.height.length - 2));

let paint = false;
let TOOL = "pen";

//Device Type

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

//GETTING IMAGE OF CANVAS

const IMAGE = new Image();
let imageArray = new Array();

function updateImageArray(image) {
    if (imageArray.length >= 9) {
        imageArray.shift();
        imageArray.push(image);
    } else {
        imageArray.push(image);
    }
}


window.addEventListener('load', () => {
    canvas.width = computedWidth;
    canvas.height = computedHeight;
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
    const tools = document.querySelector('.tools');
    if (deviceType() === "mobile") {
        tools.classList.add('--hide');
    }
});

window.addEventListener('resize', () => {
    canvas.width = computedWidth;
    canvas.height = computedHeight;
    ctx.drawImage(IMAGE, 0, 0);
});

//SHOW/HIDE 

const icon = document.querySelector('.icon');
icon.addEventListener('click', () => {
    icon.classList.toggle('--up');
    const toolbar = document.querySelector('.tools');
    toolbar.classList.toggle('--hide');
    toolbar.classList.toggle('--show')
});

//SIZE OF PEN

const slider = document.querySelector('.tools__lineWidth__slider');
const sliderLabel = document.querySelector('.tools__lineWidth__label');
slider.value = 1;
let penSize = slider.value;

slider.addEventListener('change', () => {
    penSize = slider.value;
    sliderLabel.innerText = `Size of pen : ${penSize}`;
});

// COLOR

let colorPiker = document.querySelector('.tools__color__piker');
let COLOR = colorPiker.value;

colorPiker.addEventListener('change', () => {
    COLOR = colorPiker.value;
});

// UDNO

const undo = document.querySelector('.tools__action__undo');

undo.addEventListener('click', () => {
    if (imageArray.length < 2) return;
    imageArray.pop();
    IMAGE.src = imageArray[imageArray.length - 1];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(IMAGE, 0, 0);
});

//CLEAR

const clear = document.querySelector('.tools__action__clear');

clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageArray = new Array();
});

//SHAPES

//pen

const pen = document.querySelector('.tools__shapes__pen');

function startPosition(e) {
    paint = true;
    draw(e);
}

function draw(e) {
    if (!paint) return;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

function drawToch(e) {
    if (!paint) return;
    e.preventDefault();
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
}

function stopPosition() {
    paint = false;
    ctx.beginPath();
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
}

pen.addEventListener('click', () => {
    TOOL = "pen";
    //add pen action
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopPosition);

    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchmove', drawToch);
    canvas.addEventListener('touchend', stopPosition);
    //remove rectangle action
    canvas.removeEventListener('mousedown', startRectangle);
    canvas.removeEventListener('mouseup', endRectangle);

    canvas.removeEventListener('touchstart', startRectangleTouch);
    canvas.removeEventListener('touchend', endRectangleTouches);
    //remove ellipse action
    canvas.removeEventListener('mousedown', startEllipse);
    canvas.removeEventListener('mouseup', endEllipse);

    canvas.removeEventListener('touchstart', startEllipseTouch);
    canvas.removeEventListener('touchend', endEllipseTouch);

    pen.classList.add('--selected');
    rectangle.classList.remove('--selected');
    ellipse.classList.remove('--selected');
});



//rectangle
const rectangle = document.querySelector('.tools__shapes__rectangle');
let RectX, RectY, RectW, RectH;

function startRectangle(e) {
    paint = true;
    RectX = e.clientX;
    RectY = e.clientY;
}

function startRectangleTouch(e) {
    paint = true;
    RectX = e.touches[0].clientX;
    RectY = e.touches[0].clientY;
}

function endRectangle(e) {
    paint = false;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    RectW = e.clientX - RectX;
    RectH = e.clientY - RectY;
    ctx.beginPath();
    ctx.rect(RectX, RectY, RectW, RectH);
    ctx.stroke();
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
}

function endRectangleTouches(e) {
    paint = false;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    RectW = e.changedTouches[0].clientX - RectX;
    RectH = e.changedTouches[0].clientY - RectY;
    ctx.beginPath();
    ctx.rect(RectX, RectY, RectW, RectH);
    ctx.stroke();
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
}

rectangle.addEventListener('click', () => {
    TOOL = 'rectangle'
    //remove pen action
    canvas.removeEventListener('mousedown', startPosition);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopPosition);

    canvas.removeEventListener('touchstart', startPosition);
    canvas.removeEventListener('touchmove', drawToch);
    canvas.removeEventListener('touchend', stopPosition);

    //remove ellipse action
    canvas.removeEventListener('mousedown', startEllipse);
    canvas.removeEventListener('mouseup', endEllipse);

    canvas.removeEventListener('touchstart', startEllipseTouch);
    canvas.removeEventListener('touchend', endEllipseTouch);

    //add rectangle action
    canvas.addEventListener('mousedown', startRectangle);
    canvas.addEventListener('mouseup', endRectangle);

    canvas.addEventListener('touchstart', startRectangleTouch);
    canvas.addEventListener('touchend', endRectangleTouches);

    rectangle.classList.add('--selected');
    pen.classList.remove('--selected');
    ellipse.classList.remove('--selected');
});

//ellipse

const ellipse = document.querySelector('.tools__shapes__ellipse');
let EllipseX, EllipseY, radiusX, radiusY, rotation = 0,
    startAngle = 0,
    endAngle = 2 * Math.PI;

function startEllipse(e) {
    paint = true;
    EllipseX = e.clientX;
    EllipseY = e.clientY;
}

function startEllipseTouch(e) {
    paint = true;
    EllipseX = e.touches[0].clientX;
    EllipseY = e.touches[0].clientY;
}

function endEllipse(e) {
    paint = false;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    radiusX = Math.abs(e.clientX - EllipseX) / 2;
    radiusY = Math.abs(e.clientY - EllipseY) / 2;
    tempEllipseX = EllipseX + radiusX / 2;
    tempEllipseY = EllipseY + radiusY / 2;
    ctx.beginPath();
    ctx.ellipse(tempEllipseX, tempEllipseY, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.stroke();
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
}

function endEllipseTouch(e) {
    paint = false;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOR;
    radiusX = Math.abs(e.changedTouches[0].clientX - EllipseX) / 2;
    radiusY = Math.abs(e.changedTouches[0].clientY - EllipseY) / 2;
    tempEllipseX = EllipseX + radiusX / 2;
    tempEllipseY = EllipseY + radiusY / 2;
    ctx.beginPath();
    ctx.ellipse(tempEllipseX, tempEllipseY, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.stroke();
    let canvasImage = canvas.toDataURL();
    IMAGE.src = canvasImage;
    updateImageArray(canvasImage);
}

ellipse.addEventListener('click', () => {
    TOOL = "ellipse";
    //remove pen action
    canvas.removeEventListener('mousedown', startPosition);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopPosition);

    canvas.removeEventListener('touchstart', startPosition);
    canvas.removeEventListener('touchmove', drawToch);
    canvas.removeEventListener('touchend', stopPosition);
    //remove rectangle action
    canvas.removeEventListener('mousedown', startRectangle);
    canvas.removeEventListener('mouseup', endRectangle);

    canvas.removeEventListener('touchstart', startRectangleTouch);
    canvas.removeEventListener('touchend', endRectangleTouches);
    //add ellipse action
    canvas.addEventListener('mousedown', startEllipse);
    canvas.addEventListener('mouseup', endEllipse);

    canvas.addEventListener('touchstart', startEllipseTouch);
    canvas.addEventListener('touchend', endEllipseTouch);

    ellipse.classList.add('--selected');
    pen.classList.remove('--selected');
    rectangle.classList.remove('--selected');
});

//Display current tool

const labelTool = document.querySelector('.tools__shapes__label');

// function dispalyTool(TOOL) {
//     labelTool.innerText = `TOOL : ${TOOL.toUpperCase()}`;
// }