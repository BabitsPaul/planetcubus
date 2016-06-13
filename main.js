var width = 600,
	height = 600;

var gl,
	context;

loadResources({
	vs: "/shader/colored.vs.glsl",
	fs: "/shader/colored.fs.glsl"
}).then(function(resources){
	expandSG();

	//gl
	initGL();

	//context
	context = createSGContext(gl);

	//shader
	context.shader = createProgram(gl, resources.vs, resources.fs);
	initShaders();

	initCube();

	buildSceneGraph();

	tick();
});

function expandSG()
{
	//creates node that automatically updates it's rotationmatrix
	sg.autoRotate = autoRotateMatrix;

	//node that renders cube                         //TESTING PURPOSE ONLY
	sg.drawCube = function(){
		return sg.draw(function(context){
			gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
			gl.vertexAttribPointer(context.shader.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
			gl.vertexAttribPointer(context.shader.vertexPositionAttribute, cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

			gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		});
	};
}

function initGL()
{
	gl = createContext(width, height);
	gl.viewportWidth = width;
	gl.viewportHeight = height;

	gl.clearColor(0., 0., 0.03, 1.0);
	gl.enable(gl.DEPTH_TEST);
}

//////////////////////////////////////////////////////////////////////////////////////////
// build scene graph                                                                    //
//                                                                                      //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

var root;

function buildSceneGraph()
{
	root = sg.root();

	//center of solar system
	var center_t = sg.translate(0, 0, -9);
	root.append(center_t);

	//center of solar system
	var rotate_c = sg.autoRotate(0.4, 0.2, 0.6);
	center_t.append(rotate_c);
	rotate_c.append(sg.drawCube());

	//first planet
	var rotate_1 = sg.autoRotate(0.1, 2, 0);
	var radius_1 = sg.translate(0, 0, 5);
	center_t.append(rotate_1);
	rotate_1.append(radius_1);
	radius_1.append(sg.drawCube());

	//moon of first planet
	var rotate_1_m_o_1 = sg.rotateX(90);
	var rotate_1_m_r_1 = sg.autoRotate(2, 0, 0);
	var radius_1_m_r_1 = sg.translate(2, 0, 0);
	var scale_1_m_1 = sg.scale(0.4, 0.4, 0.4);
	radius_1.append(rotate_1_m_o_1);
	rotate_1_m_o_1.append(rotate_1_m_r_1);
	rotate_1_m_r_1.append(radius_1_m_r_1);
	rotate_1_m_r_1.append(scale_1_m_1);
	scale_1_m_1.append(sg.drawCube());
}

//////////////////////////////////////////////////////////////////////////////////////////
// shaders                                                                              //
//                                                                                      //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

function initShaders()
{
	//register shader
	gl.useProgram(context.shader);

	context.shader.vertexPositionAttribute = gl.getAttribLocation(context.shader, "a_position");
	gl.enableVertexAttribArray(context.shader.vertexPositionAttribute);

	context.shader.vertexColorAttribute = gl.getAttribLocation(context.shader, "a_color");
	gl.enableVertexAttribArray(context.shader.vertexColorAttribute);

	context.shader.pMatrixUniform = gl.getUniformLocation(context.shader, "u_projection");
	context.shader.mvMatrixUniform = gl.getUniformLocation(context.shader, "u_modelView");
}

////////////////////////////////////////////////////////////////////////////////////////////////
// rendering                                                                                  //
//                                                                                            //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////

function tick()
{
	draw();
	animate();

	requestAnimationFrame(tick);
}

function draw()
{
	//setup viewport and clear canvas
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	root.render(context);
}

///////////////////////////////////////////////////////////////////////////////////////////
// timing                                                                                //
//                                                                                       //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////

var lastTime = new Date().getTime();
var elapsedSinceLastTick;

function animate()
{
	var timeNow = new Date().getTime();
 	elapsedSinceLastTick = timeNow - lastTime;

	lastTime = timeNow;

	toUpdate.forEach(function(f){
		f(elapsedSinceLastTick);
	})
}

function autoRotateMatrix(rsX, rsY, rsZ)
{
	var rotMat = mat4.create();
	var node = new TransformationSGNode(rotMat);

	toUpdate.push(function(dt){
		var tmp = node.matrix;

		mat4.rotateX(tmp, tmp, rsX * dt / 1000.);
		mat4.rotateY(tmp, tmp, rsY * dt / 1000.);
		mat4.rotateZ(tmp, tmp, rsZ * dt / 1000.);

		node.matrix = tmp;
	});

	return node;
}

var toUpdate = [];

///////////////////////////////////////////////////////////////////////////////////////////
// utility                                                                               //
//                                                                                       //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////

function degToRad(deg)
{
	return deg * Math.PI / 180;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// cube                                                                                                   //
//                                                                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawCube()
{
	//draw cube
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.vertexAttribPointer(context.shader.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
	gl.vertexAttribPointer(context.shader.vertexPositionAttribute, cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

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
