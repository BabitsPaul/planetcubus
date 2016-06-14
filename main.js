var width = 600,
	height = 600;

var gl,
	context;

loadResources({
	vs: "/shader/colored.vs.glsl",
	fs: "/shader/colored.fs.glsl",
	img: "crate.gif"
}).then(function(resources){
	texImg = resources.img;

	expandSG();

	//gl
	initGL();

	//context
	context = createSGContext(gl);

	//shader
	context.shader = createProgram(gl, resources.vs, resources.fs);
	initShaders();

	//init ui
	initUI(gl.canvas);

	//init structures for rendering
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

var texImg;

var root;

function buildSceneGraph()
{
	root = cameraNode();

	//center of solar system
	var center = sg.translate(0, 0, -9);
	root.append(center);

	center.append(sg.drawCube());

	/*
	var planet1 = createObject(sg.drawCube(), 1, 45, 45);
	var planet1Orbit = createOrbitingObject(planet1, 4, 2, 20, 0);
	center.append(planet1Orbit);

	var planet2 = createObject(sg.drawCube(), 0.5, 45, 45);
	var planet2Orbit = createOrbitingObject(planet2, 6, 1.5, 20, 0);
	center.append(planet2Orbit);

	var moon1_1 = createObject(sg.drawCube(), 0.5, 45, 45, 0.5, 0.5, 0.5);
	var moon1_1Orbit = createOrbitingObject(moon1_1, 3, 0.5, 0, 0);
	planet2.append(moon1_1Orbit);
	*/
}

/*
* obj: object that orbits around an implicit center (0,0,0)
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
var totalSpeed = 1;		//TESTING PURPOSE ONLY

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
