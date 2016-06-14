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
	var center = sg.translate(0, 0, -9);
	root.append(center);

	var planet1 = createObject(sg.drawCube(), 1, 45, 45);
	var planet1Orbit = createOrbitingObject(planet1, 4, 2, 20, 0);
	center.append(planet1Orbit);

	var planet2 = createObject(sg.drawCube(), 0.5, 45, 45);
	var planet2Orbit = createOrbitingObject(planet2, 6, 1.5, 20, 0);
	center.append(planet2Orbit);

	var moon1_1 = createObject(sg.drawCube(), 0.5, 45, 45, 0.5, 0.5, 0.5);
	var moon1_1Orbit = createOrbitingObject(moon1_1, 3, 0.5, 25, 45);
	planet2.append(moon1_1Orbit);
}

/*
* center: object around with the created object circles
* obj: object that rotates around center
* radius: radius of the orbit
* rS: rotation-speed on orbit
* otx: orbital tilt of object on x-axis (z-x-plane as reference = 0deg)
* otz: orbital tilt of object on z-axis (z-x-plane as reference = 0deg)
*/
function createOrbitingObject(obj, radius , rS, oTx, oTz)
{
	var rotation = sg.autoRotate(0, rS, 0);
	var orbitalTiltX = sg.rotateX(oTx);
	var orbitalTiltZ = sg.rotateZ(oTz);
	var translate = sg.translate(radius, 0, 0);

	orbitalTiltX.append(orbitalTiltZ);
	orbitalTiltZ.append(rotation);
	rotation.append(translate);
	translate.append(obj);

	return orbitalTiltX;
}

/*
* obj: animated object
* rS: rotation-speed around y-axis
* atx: axial tilt, on x-axis (z-x-plane as reference)
* atz: axial tilt, on z-axis (z-x-plane as reference)
*/
function createObject(obj, rS, aTx, aTz , sX, sY, sZ)
{
	sX = sX || 1;
	sY = sY || 1;
	sZ = sZ || 1;

	aTx = aTx || 0;
	aTz = aTz || 0;

	var axialTiltX = sg.rotateX(aTx);
	var axialTiltZ = sg.rotateZ(aTz);
	var selfRotation = sg.autoRotate(0, rS, 0);
	var scaling = sg.scale(sX, sY, sZ);

	axialTiltX.append(axialTiltZ);
	axialTiltZ.append(selfRotation);
	selfRotation.append(scaling);
	scaling.append(obj);

	return axialTiltX;
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

//regulates the overall speed of the animation
var totalSpeed = .1;		//TESTING PURPOSE ONLY

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

		mat4.rotateX(tmp, tmp, rsX * dt / 1000. * totalSpeed);
		mat4.rotateY(tmp, tmp, rsY * dt / 1000. * totalSpeed);
		mat4.rotateZ(tmp, tmp, rsZ * dt / 1000. * totalSpeed);

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
