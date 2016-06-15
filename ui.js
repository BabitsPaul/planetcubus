//calibration
var rotateSensitivity = .003;
var moveSensivity = .1;

var	cameraPosition,
	cameraOrientation;

var mouse;

var cameraTransformNode;

function updateViewMatrix(context)
{
	cameraTransformNode.matrix = mat4.multiply(mat4.create(), cameraPosition, cameraOrientation);
}

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

	cameraPosition = mat4.create();
	cameraOrientation = mat4.create();

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
	var move = mat4.translate(mat4.create(), mat4.create(), [dx * moveSensivity, 0, dz * moveSensivity]);
	move = mat4.multiply(mat4.create(), move, cameraOrientation);

	cameraPosition = mat4.multiply(mat4.create(), cameraPosition, move);
}

/*
* dalpha = horizontal rotation
* dbet = vertical rotation
*/
function rotateCamera(dalpha, dbeta)
{
	cameraOrientation = mat4.rotateX(mat4.create(), cameraOrientation, dalpha * rotateSensitivity);
	cameraOrientation = mat4.rotateY(mat4.create(), cameraOrientation, dbeta * rotateSensitivity);
}
