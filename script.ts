const vertices = [
    [-1, -1, -1], [1, -1 ,-1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1 , 1], [1, 1, 1], [-1, 1, 1]
]
const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
]

let globalFocalLength = 300;
let globalAxis = '';
let angle = 0;

function initCanvas(canvasEl: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

function getRotatedCoordinates(axis: string, x:number, y:number, z:number, angle:number) {
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

function project(ctx: CanvasRenderingContext2D, vertices: number[][], edges: number[][],  focalLength: number, angle:number) {
    ctx.fillStyle = "blue";

    let vertexProjectionMap:number[][] = [];
    let i = 0;

    for (const vertex of vertices) {
        let rotatedVertex;
        if (globalAxis != "") {
            rotatedVertex = getRotatedCoordinates(globalAxis, vertex[0], vertex[1], vertex[2], angle);
        } else {
            rotatedVertex = vertex;
        }

        const x = rotatedVertex[0] * 50;
        const y = rotatedVertex[1] * 50;
        const z = rotatedVertex[2] * 50;

        const projectedX = (focalLength * x) / (focalLength + z);
        const projectedY = (focalLength * y) / (focalLength + z);
        
        vertexProjectionMap[i] = [projectedX + 500, projectedY + 200];

        ctx.beginPath()
        ctx.arc(projectedX + 500, projectedY + 200, 5, 0, 2 * Math.PI);
        ctx.fill();

        i++;
    }

    for (const edge of edges) {
        const from = edge[0];
        const to = edge[1];

        ctx.beginPath()
        ctx.moveTo(vertexProjectionMap[from][0], vertexProjectionMap[from][1]);
        ctx.lineTo(vertexProjectionMap[to][0], vertexProjectionMap[to][1]);
        ctx.stroke();
    }
}

function start(focalLength: number, angle: number) {
    console.log(focalLength);

    const canvasEl = document.querySelector("canvas")!;

    const ctx = canvasEl.getContext("2d")!;

    initCanvas(canvasEl, ctx);

    project(ctx, vertices, edges, focalLength, angle);

    angle+=0.01;

    setTimeout(() => start(globalFocalLength, angle), 1/15);
}

window.onload = () => {
    const slider = document.querySelector("#focalLengthSlider") as HTMLInputElement;
    

    const xButton: HTMLButtonElement = document.querySelector("#xButton")!;
    const yButton: HTMLButtonElement = document.querySelector("#yButton")!;
    const zButton: HTMLButtonElement = document.querySelector("#zButton")!;
    const steadyButton: HTMLButtonElement = document.querySelector("#steadyButton")!;

    document.querySelector("#focalLengthLabel")!.innerHTML = slider.value;
    globalFocalLength = slider.valueAsNumber;


    slider.onchange = () => {
        globalFocalLength = slider.valueAsNumber;
        document.querySelector("#focalLengthLabel")!.innerHTML = slider.value;
    }

    xButton.onclick = () => {
        globalAxis = 'x';
    }
    yButton.onclick = () => {
        globalAxis = 'y';
    }
    zButton.onclick = () => {
        globalAxis = 'z';
    }
    steadyButton.onclick = () => {
        globalAxis = "";
    }

    requestAnimationFrame(() => start(globalFocalLength, angle % 2*Math.PI));
}