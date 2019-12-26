
// Z = C*C + C // C is the complex number
// Z' = Z * Z + C // Z is the previous result and C is the same complex number
// Z'' = Z' * Z' + C // and so on.... keep repeating this calculation. check if Z'' after 10-20 calculations is smaller than a number like 5
// if it is, then it belongs to the mandelbrot set, if not it is not part of the set
// C = X + iY
// C*C = (X + iY) * (X + iY) = X^2 -Y^2 +2iXY

function checkIfBelongsToMandelbrotSet(x, y) {
    var realComponentOfResult = x;
    var imaginaryComponentOfResult = y;
    const MAX_ITERATIONS = 60;

    for (var i = 0; i < MAX_ITERATIONS; i++) {
        // Calculate the real and imaginary components of the result
        // separately
        var tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;

        var tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult + y;

        realComponentOfResult = tempRealComponent;
        imaginaryComponentOfResult = tempImaginaryComponent;

        if (realComponentOfResult * imaginaryComponentOfResult > 5) {
            return (i / MAX_ITERATIONS) * 100; // Not in the Mandelbrot set, get a sense of how far
        }
    }
    return 0; // in the set
}

const pixel = (x, y, color) => ({
    color,
    x,
    y
})

const randomSign = () => Math.random() > .5 ? 1 : -1

function computeCanvas(startX, width, startY, height) {
    var map = []
    var magnificationFactor = 200 + Math.random() * 1000;
    var panX = randomSign() * Math.random() * 2;
    var panY = randomSign() * Math.random() * 2;
    var colorRange = Math.floor(Math.random() * 180);
    for (var x = startX; x < startX + width; x++) {
        for (var y = startY; y < startY + height; y++) {
            var belongsToSet = checkIfBelongsToMandelbrotSet(
            x / magnificationFactor - panX,
            y / magnificationFactor - panY);
            if (belongsToSet) {
                var px = pixel(x - startX, y - startY, 'hsl(' + (colorRange + belongsToSet * (colorRange / 100)) + ', 100%, ' + belongsToSet + '%)')
                map.push(px)
            }
            //  else {
                // not in the set... if it's "black", dont use it
                // map[x - startX][y - startY] = pixel(x - startX, y - startY, '#000')
            // }
        }
    }
    return map
}

self.onmessage = ({data}) => {
    var canvasMap = computeCanvas(data.x, data.width, data.y, data.height)
    self.postMessage({i: data.i, map: canvasMap})
}

