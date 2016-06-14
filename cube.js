////////////////////////////////////////////////////////////////////////////////////////////////////////////
// cube                                                                                                   //
//                                                                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

var cubeVertexBuffer,
	cubeVertexColorBuffer,
	cubeVertexIndexBuffer,
	cubeVertexNormalBuffer;

function initCube()
{
	var size = 0.5;

	cubeVertices = new Float32Array([
		size, size, size, //right top front			0		right
		size, size, size, //						1		top
		size, size, size, //						2		front

		size, size, -size, //right top back			3		right
		size, size, -size, //						4		top
		size, size, -size, //						5		back

		size, -size, size, //right bottom front		6		right
		size, -size, size, //						7		bottom
		size, -size, size, //						8		front

		size, -size, -size, //right bottom back		9		right
		size, -size, -size, //						10		bottom
		size, -size, -size,	//						11		back

		-size, size, size, //left top front			12		left
		-size, size, size, //						13		top
		-size, size, size, //						14		front

		-size, size, -size, //left top back			15		left
		-size, size, -size, //						16		top
		-size, size, -size, //						17		back

		-size, -size, size, //left bottom front		18		left
		-size, -size, size, //						19		bottom
		-size, -size, size, //						20		front

		-size, -size, -size, //left bottom back		21		left
		-size, -size, -size, //						22		bottom
		-size, -size, -size  //						23		back
	]);

	var cubeColors = [		//TESTING PURPOSE ONLY
		0, 0, 0, 1,
		1, 0, 0, 1,
		0, 0, 1, 1,

		0, 0, 0, 1,
		1, 0, 0, 1,
		1, 1, 0, 1,

		0, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		0, 0, 0, 1,
		0, 1, 0, 1,
		1, 1, 0, 1,

		1, 1, 1, 1,
		1, 0, 0, 1,
		0, 0, 1, 1,

		1, 1, 1, 1,
		1, 0, 0, 1,
		1, 1, 0, 1,

		1, 1, 1, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 1, 1, 1,
		0, 1, 0, 1,
		1, 1, 0, 1
	];

	var textureCoordinates = [
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0,

		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 1.0,
		1.0, 0.0,

		1.0, 0.0,
		1.0, 0.0,
		0.0, 0.0,

		1.0, 1.0,
		0.0, 0.0,
		0.0, 1.0,

		0.0, 1.0,
		0.0, 1.0,
		1.0, 1.0,

		1.0, 0.0,
		0.0, 1.0,
		0.0, 0.0,

		0.0, 0.0,
		0.0, 0.0,
		1.0, 0.0
	];

	var normals = [1, 0, 0,
				0, 1, 0,
				0, 0, 1,

				1, 0, 0,
				0, 1, 0,
				0, 0, -1,

				1, 0, 0,
				0, -1, 0,
				0, 0, 1,

				1, 0, 0,
				0, -1, 0,
				0, 0, -1,

				-1, 0, 0,
				0, 1, 0,
				0, 0, 1,

				-1, 0, 0,
				0, 1, 0,
				0, 0, -1,

				-1, 0, 0,
				0, -1, 0,
				0, 0, 1,

				-1, 0, 0,
				0, -1, 0,
				0, 0, -1,
			];

	var cubeIndices = [
		0, 3, 6, 	6, 3, 9,		//right
		1, 4, 13,	4, 13, 16,		//top
		2, 8, 14,	8, 14, 20,		//front
		5, 11, 17,	11, 17, 23,		//back
		7, 10, 19, 	10, 19, 22, 	//bottom
		12, 15, 18,	15, 18, 21		//left
	];

	cubeVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
	cubeVertexBuffer.itemSize = 3;
	cubeVertexBuffer.numItems = 24;

	cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
	cubeVertexIndexBuffer.itemSize = 1;
	cubeVertexIndexBuffer.numItems = 36;

	cubeTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
	cubeTextureBuffer.itemSize = 2;
	cubeTextureBuffer.numItems = 24;

	cubeVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);
	cubeVertexColorBuffer.itemSize = 4;
	cubeVertexColorBuffer.numItems = 24;

	cubeVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	cubeVertexNormalBuffer.itemSize = 3;
	cubeVertexNormalBuffer.numItems = 24;
}
