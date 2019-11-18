window.onload = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = document.querySelector('canvas')!;
    const c = canvas.getContext('2d')!;

    // Creating variables so the graphics are zoomable and pannable
    let scale = 1;
    let transX = 0;
    let transY = 0;
    // Declaring the leftupper point of the canvas and the rightlower point of the canvas
    let leftUpperPointX = 0;
    let leftUpperPointY = 0;
    let rightLowerPointX = window.innerHeight;
    let rightLowerPointY = window.innerHeight;

    const webSocket = new WebSocket('ws://' + location.host);

    let strokes: any[] = [];
    webSocket.onmessage = message => {
        strokes = JSON.parse(message.data);
        drawStrokes(strokes);
    };

    webSocket.onopen = () => {
        console.log('connected');
    };

    canvas.width = width;
    canvas.height = height;

    const figure = 'circle';

    canvas.onwheel = event => {
        event.preventDefault();
        const currentXCoord = event.clientX;
        const currentYCoord = event.clientY;

        if (event.deltaY < 0) {
            // Zoom in
            scale += event.deltaY;
        } else {
            // Zoom out
            scale /= event.deltaY;
        }
        console.log(scale);

        // Moving the canvas bounding box
        leftUpperPointX =
            currentXCoord - ((leftUpperPointX - rightLowerPointX) * scale) / 2;
        leftUpperPointY =
            currentYCoord - ((leftUpperPointY - rightLowerPointY) * scale) / 2;
        rightLowerPointX =
            currentXCoord + ((leftUpperPointX - rightLowerPointX) * scale) / 2;
        rightLowerPointY =
            currentYCoord + ((leftUpperPointY - rightLowerPointY) * scale) / 2;
    };

    // Drawing something depending on the selected figure
    switch (figure) {
        // Drawing a circle
        case 'circle':
            let centerXCircle;
            let centerYCircle;
            // Fixing circle center
            canvas.onmousedown = event => {
                centerXCircle = event.clientX;
                centerYCircle = event.clientY;
            };

            canvas.onmousemove = event => {
                // Getting radius while moving mouse and drawing temporar circle
                let radius = Math.sqrt(
                    Math.pow(event.clientX, 2) + Math.pow(event.clientY, 2)
                );
                redraw(transX, transY, scale);
                drawCircle(centerXCircle, centerYCircle, radius);
            };
            canvas.onmouseup = event => {
                let radius = Math.sqrt(
                    Math.pow(event.clientX, 2) + Math.pow(event.clientY, 2)
                );
                drawCircle(centerXCircle, centerYCircle, radius);
                const stroke = {
                    type: 'circle',
                    x: centerXCircle,
                    y: centerXCircle,
                    radius: radius,
                    minXBB: centerXCircle - radius,
                    minYBB: centerYCircle - radius,
                    maxXBB: centerXCircle + radius,
                    maxYBB: centerYCircle + radius,
                };
                addStroke(stroke);
            };
            break;
        default:
            break;
    }

    // Adding input parameter stroke to strokes
    function addStroke(stroke) {
        webSocket.send(
            JSON.stringify({
                command: 'addStrokes',
                strokes: [stroke],
            })
        );
        strokes.push(stroke);
        drawStroke(stroke);
    }

    /*
    Drawing the strokes, calling functions depending on the type of the stroke
    Avaible types:
    circle
    */
    function drawStroke(stroke) {
        if (stroke.type == 'circle') {
            drawCircle(stroke.x, stroke.y, stroke.radius);
        }
    }

    /*
    Drawing a circle 
    @param 
    coordinateX - X center of the circle
    coordinateY - Y center of the circle
    radius - radius of the circle
    */
    function drawCircle(coordinateX, coordinateY, radius) {
        c.beginPath();
        c.arc(coordinateX, coordinateY, radius, 0, 2 * Math.PI);
        c.fill();
    }

    // Redrawing picture
    function redraw(_transX, _transY, _scale) {
        c.fillStyle = 'white';
        c.fillRect(0, 0, width, height);
        drawStrokes(strokes);
        c.fillStyle = 'black';
    }

    // Going through all strokes and calling the function drawStroke()
    function drawStrokes(strokes) {
        for (const stroke of strokes) {
            drawStroke(stroke);
        }
    }
};
