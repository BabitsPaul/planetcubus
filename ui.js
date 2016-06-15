//calibration
var rotateSensitivity = .003;
var moveSensivity = .1;

var mouse;

var cameraTransformNode;

/*
var rotateX,
	rotateY,
	pos;
*/

var cameraPosition,
	cameraOrientation;

function initUI(canvas)
{
	mouse = {
		pos: {
			x: 0,
			y: 0
		},

		pressed: false
	};

	cameraTransformNode = new TransformationSGNode(mat4.create());

	/*
	rotateX = rotateY = 0;
	pos = [0, 0, 0];
	*/

	cameraPosition = mat4.identity(mat4.create());
	cameraOrientation = mat4.identity(mat4.create());

	canvas.addEventListener('mousedown' , function(event){
		mouse.pressed = true;

		mouse.pos.x = event.clientX;
		mouse.pos.y = event.clientY;
	});

	canvas.addEventListener('mouseup', function(event){
		mouse.pressed = false;

		mouse.pos.x = 0;
		mouse.pos.y = 0;
	});

	canvas.addEventListener('mousemove', function(event){
		if(mouse.pressed && mouse.pos.x && mouse.pos.y){
			rotateCamera(event.clientY - mouse.pos.y, event.clientX - mouse.pos.x);

			mouse.pos.x = event.clientX;
			mouse.pos.y = event.clientY;
		}
	});

	document.addEventListener('keypress', function(event){
		var consumed = true;

		switch(event.key){
			case "ArrowDown":
				moveCamera(0, 1);
			break;
			case "ArrowUp":
				moveCamera(0, -1);
			break;
			case "ArrowLeft":
				moveCamera(-1, 0);
			break;
			case "ArrowRight":
				moveCamera(1, 0);
			break;
			default:
				consumed = false;
			break;
		}

		if(consumed)
		{
			event.preventDefault();
		}
	});
}

/*
* move camera by specified distance along x and z axis
* takes current orientation and position into account
*/
function moveCamera(dx, dz)
{
	cameraPosition = mat4.translate(mat4.create(), cameraPosition, [dx * moveSensivity, 0, dz * moveSensivity]);

	/*
	//TODO reacts properly, until camera is rotated
	var tmp = mat4.translate(mat4.create(), mat4.create(), [dx * moveSensivity, 0, dz * moveSensivity]);
	tmp = mat4.multiply(mat4.create(), cameraOrientation, tmp);

	cameraPosition = mat4.multiply(mat4.create(), cameraPosition, cameraOrientation);
	*/

	cameraTransformNode.matrix = cameraPosition;//mat4.multiply(mat4.create(), cameraPosition, cameraOrientation);
}

/*
* dalpha = horizontal rotation
* dbet = vertical rotation
*/
function rotateCamera(dalpha, dbeta)
{
	var tmp = mat4.rotateX(mat4.create(), mat4.create(), dalpha * rotateSensitivity);
	tmp = mat4.rotateY(mat4.create(), tmp, dbeta * rotateSensitivity);

	cameraOrientation = mat4.multiply(mat4.create(), cameraOrientation, tmp);

	cameraTransformNode.matrix = mat4.multiply(mat4.create(), cameraTransformNode.matrix, tmp);
}
