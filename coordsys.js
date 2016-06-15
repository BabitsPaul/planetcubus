//calibration
var axisLength = 5;
var xAxisColor = [1, 0, 0, 1],
	yAxisColor = [0, 1, 0, 1],
	zAxisColor = [0, 0, 1, 1];

var drawCoordSys;

function initCoordSys()
{
	var vertexBuffer,
		colorBuffer;

	var vertices = [
		0, 0, 0,	axisLength, 0, 0,	//x-axis
		0, 0, 0,	0, axisLength, 0,	//y-axis
		0, 0, 0,	0, 0, axisLength	//z-axis
	];

	var colors = [].concat(
		xAxisColor, xAxisColor,
		yAxisColor, yAxisColor,
		zAxisColor, zAxisColor
	);

	console.log(colors.length);
	console.log(vertices.length)

	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 6;

	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	colorBuffer.itemSize = 4;
	colorBuffer.numItems = 6;

	drawCoordSys = function(context){
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(context.shader.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(context.shader.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.LINES, vertexBuffer.numItems, gl.FLOAT);
	}
}
