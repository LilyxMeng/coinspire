var socket = io();
let cnv;


cnv = document.getElementById("cnv");
cnv.width = 2000;
cnv.height = 2000;
const padding = 75;
//cnv.style.backgroundColor = "black";
cnv.style.border = "1px solid black";
cnv.style.padding.top = padding + "px";


var ctx = cnv.getContext("2d");


var colour = "#0000ff";
var colorWell;
var defaultColor = "#0000ff";

window.addEventListener("load", startup, false);

function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = defaultColor;
  colorWell.addEventListener("input", updateFirst, false);
  colorWell.select();
}

function updateFirst(event) {
  var p = document.querySelector("p");

  if (p) {
    p.style.color = event.target.value;
    console.log(event.target.value);
    colour = event.target.value;
  }
}

console.log("colour: " + colour);

ctx.fillStyle = colour;

ctx.fillStyle = "#212529";
ctx.fillRect(0, 0, cnv.width, cnv.height);


ctx.lineWidth = 2;
//for loop to draw the grid
for (var i = 0; i < cnv.width; i += 10) {
  ctx.moveTo(i, 0);
  ctx.lineTo(i, cnv.height);
  ctx.moveTo(0, i);
  ctx.lineTo(cnv.width, i);
}
ctx.stroke();

var data;


console.log(data);
//for loop over results
//for (var x = 0; x < 2000; x++) {
//for (var y = 0; y < 2000; y++) {
//console.log(data?.[x]?.[y])
//if (typeof data?.[x]?.[y] !== 'undefined') {
//ctx.fillStyle = data[x][y];
//  ctx.fillRect(i * 10, i * 10, 10, 10);
console.log("YAYAYAY")
//}
// }
// }

// if download button is clicked, download the file
var downloadButton = document.getElementById("download");
downloadButton.onclick = function() {
  var dataURL = cnv.toDataURL();
  var link = document.createElement("a");
  link.download = "my-image.png";
  link.href = dataURL;
  link.click();
};



//add event listener to canvas

var timeout = Date.now() - 2000;
console.log("timeout", timeout);

cnv.addEventListener("click", function (event) {
  console.log(Date.now(), timeout);

  if (Date.now() - timeout >= 1000) {
    var x = Math.floor((event.pageX) / 10) * 10;
    var y = Math.floor((event.pageY - padding) / 10) * 10;
    socket.emit('chat message', { X: x, Y: y, F: colour });
    console.log(x, y);
    timeout = Date.now();
    var count = 1;
    var interval = setInterval(function () {
      count -= 0.1;
      document.getElementById("timeout").innerHTML = "Timeout: " + Math.round(10 * count) / 10 + "s";
      if (count <= 0) {
        clearInterval(interval);
        document.getElementById("timeout").innerHTML = "Timeout: 0.0s";
        return;
      }
      console.log(count);
    }, 100);  } else {
    console.log("Too soon!");
  }
});

socket.on('chat message', function (msg) {
  ctx.fillStyle = msg.F;
  ctx.fillRect(msg.X, msg.Y, 10, 10);
  console.log(msg);
});

socket.on('data', function (msg) {
  //loop over array of objects
  for (var i = 0; i < msg.length; i++) {
    ctx.fillStyle = msg[i].color;
    ctx.fillRect(msg[i].x, msg[i].y, 10, 10);
  }
});

