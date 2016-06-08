//the OpenGL context
var gl = null,
    program = null;

var sqrBuf, colBuf;

/**
* initializes OpenGL context, compile shader, and load buffers
*/
function init(resources) {
    //create a GL context
    gl = createContext(1200 /*width*/, 600 /*height*/);

    //compile and link shader program
    program = createProgram(gl, resources.vs, resources.fs);
}

/**
* render one frame
*/
function render() {

    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    //clear the buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    sqrBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sqrBuf, gl.STATIC_DRAW);

    colBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf, gl.STATIC_DRAW);

    const arr = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0]);

		/*
    const arr = new Float32Array([1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 1, 0, 1,
        0, 0, 0, 1]);
		*/


    //request another call as soon as possible
    //requestAnimationFrame(render);
}

//load the shader resources using a utility function
loadResources({
    vs: 'shader/empty.vs.glsl',
    fs: 'shader/empty.fs.glsl'
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
    init(resources);

    //render one frame
    render();
});

/////////////////////////////////////////////////////////////////////////////////////////////
// render context                                                                          //
//                                                                                         //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
// SceneGraph                                                                              //
//                                                                                         //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

class SceneGraphNode
{
	constructor()
	{
		this.children = [];
	}

	append(child)
	{
		this.children.push(child);
	}

	remove(child)
	{
		index = this.children.indexOf(child);

		if(index != -1)
		{
			this.children.splice(index, 1);
		}
	}

	render(context)
	{
		console.log("Rendering "+ this);

		for each (var child in children)
		{
			child.render(context);
		}
	}
}

class TransformationNode
	extends SceneGraphNode
{
	constructor(matrix)
	{
		super();
		this.translation = matrix;
	}

	setMatrix(matrix)
	{
		this.matrix = matrix;
	}

	render(context)
	{
		backupMatrix = context.sceneMatrix;

		context.sceneMatrix = mat4.multiply(context.sceneMatrix, this.matrix);
		for each (var child in children)
		{
			child.render(context);
		}

		context.sceneMatrix = backupMatrix;
	}
}

class ShaderNode
	extends SceneGraphNode
{
	constructor(shader)
	{
		super();

		this.shader = shader;
	}

	setShader(shader)
	{
		this.shader = shader;
	}

	render(context)
	{
		backupShader = context.shader;

		context.shader = this.shader;
		for each (var child in children)
		{
			child.render(context);
		}

		context.shader = this.shader;
	}
}

class ModelRenderNode
	extends SceneGraphNode
{
	constructor(model)
	{
		super();

		this.model = model;
	}

	setModel(model)
	{
		this.model = model;
	}

	render(context)
	{
		TODO
	}
}
