var rotateSensitivity = .0005;
var moveSensivity = .1;

var cameraMat;

var mouse;

function cameraNode()
{
	var node = new TransformationSGNode(cameraMat);

	return node;
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

	cameraMat = mat4.create();

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
			rotateCamera(event.clientX - mouse.pos.x, event.clientY - mouse.pos.y);

			mouse.pos.x = event.clientX;
			mouse.pros.y = event.clientY;
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
*/
function moveCamera(dx, dz)
{
	console.log("Rotating");
	mat4.translate(cameraMat, cameraMat, [dx * moveSensivity, 0, dz * moveSensivity]);
}

/*
* dalpha = horizontal rotation
* dbet = vertical rotation
*/
function rotateCamera(dalpha, dbeta)
{
	mat4.rotateX(cameraMat, cameraMat, dalpha * rotateSensitivity);
	mat4.rotateY(cameraMat, cameraMat, dbeta * rotateSensitivity);
}
