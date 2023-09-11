"use strict";
const vertices = [
    /*[-1, -1, -1], [1, -1 ,-1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1 , 1], [1, 1, 1], [-1, 1, 1]*/
    // Front face
    [-1, -1, -1], [-1, 1, -1], [1, -1, -1],
    [-1, 1, -1], [1, 1, -1], [1, -1, -1],
    // Back face
    [-1, -1, 1], [-1, 1, 1], [1, -1, 1],
    [-1, 1, 1], [1, 1, 1], [1, -1, 1],
    // Left face
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1],
    [-1, 1, -1], [-1, 1, 1], [-1, -1, 1],
    // Right face
    [1, -1, -1], [1, -1, 1], [1, 1, -1],
    [1, 1, -1], [1, 1, 1], [1, -1, 1],
    // Up face
    [-1, 1, -1], [-1, 1, 1], [1, 1, -1],
    [1, 1, -1], [1, 1, 1], [-1, 1, 1],
    // Down face
    [-1, -1, -1], [-1, -1, 1], [1, -1, -1],
    [1, -1, -1], [1, -1, 1], [-1, -1, 1]
];
let globalFocalLength = 300;
let globalAxis = '';
let angle = 0;
function initCanvas(canvasEl, ctx) {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}
function getRotatedCoordinates(axis, x, y, z, angle) {
    let newX = x;
    let newY = y;
    let newZ = z;
    switch (axis) {
        case 'x':
            newY = y * Math.cos(angle) - z * Math.sin(angle);
            newZ = y * Math.sin(angle) + z * Math.cos(angle);
            return [newX, newY, newZ];
        case 'y':
            newX = x * Math.cos(angle) - z * Math.sin(angle);
            newZ = x * Math.sin(angle) + z * Math.cos(angle);
            return [newX, newY, newZ];
        case 'z':
            newX = x * Math.cos(angle) - y * Math.sin(angle);
            newY = x * Math.sin(angle) + y * Math.cos(angle);
            return [newX, newY, newZ];
    }
    return [x, y, z];
}
function drawTriangle(ctx, vertices, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(vertices[0][0], vertices[0][1]);
    ctx.lineTo(vertices[1][0], vertices[1][1]);
    ctx.lineTo(vertices[2][0], vertices[2][1]);
    ctx.closePath();
    ctx.stroke();
    //ctx.fill()
}
function project(ctx, vertices, focalLength, angle) {
    ctx.fillStyle = "blue";
    let vertexProjectionMap = [];
    for (let i = 0; i < vertices.length; i++) {
        let rotatedVertex = vertices[i];
        if (globalAxis != "") {
            rotatedVertex = getRotatedCoordinates(globalAxis, vertices[i][0], vertices[i][1], vertices[i][2], angle);
        }
        const x = rotatedVertex[0] * 50;
        const y = rotatedVertex[1] * 50;
        const z = rotatedVertex[2] * 50;
        const projectedX = (focalLength * x) / (focalLength + z);
        const projectedY = (focalLength * y) / (focalLength + z);
        vertexProjectionMap[i] = [projectedX + 500, projectedY + 200];
        ctx.beginPath();
        ctx.arc(projectedX + 500, projectedY + 200, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    for (let i = 0; i < vertexProjectionMap.length; i += 3) {
        const currentTriangle = [
            [vertexProjectionMap[i][0], vertexProjectionMap[i][1], vertexProjectionMap[i][2]],
            [vertexProjectionMap[i + 1][0], vertexProjectionMap[i + 1][1], vertexProjectionMap[i + 1][2]],
            [vertexProjectionMap[i + 2][0], vertexProjectionMap[i + 2][1], vertexProjectionMap[i + 2][2]]
        ];
        drawTriangle(ctx, currentTriangle, "#f00");
    }
}
function start(focalLength, angle) {
    console.log(focalLength);
    const canvasEl = document.querySelector("canvas");
    const ctx = canvasEl.getContext("2d");
    initCanvas(canvasEl, ctx);
    project(ctx, vertices, focalLength, angle);
    angle += 0.01;
    setTimeout(() => start(globalFocalLength, angle), 1 / 15);
    //drawTriangle(ctx, [[100, 200], [400, 500], [300, 100]], "#f00")
}
window.onload = () => {
    const slider = document.querySelector("#focalLengthSlider");
    const xButton = document.querySelector("#xButton");
    const yButton = document.querySelector("#yButton");
    const zButton = document.querySelector("#zButton");
    const steadyButton = document.querySelector("#steadyButton");
    document.querySelector("#focalLengthLabel").innerHTML = slider.value;
    globalFocalLength = slider.valueAsNumber;
    slider.onchange = () => {
        globalFocalLength = slider.valueAsNumber;
        document.querySelector("#focalLengthLabel").innerHTML = slider.value;
    };
    xButton.onclick = () => {
        globalAxis = 'x';
    };
    yButton.onclick = () => {
        globalAxis = 'y';
    };
    zButton.onclick = () => {
        globalAxis = 'z';
    };
    steadyButton.onclick = () => {
        globalAxis = "";
    };
    start(0, 0);
};
