function buildCylinder(radius, height, density, colorTop, colorSide, colorBottom)
{
	var verticesTop = [],
		verticesBottom = [],
		verticesSide = [];

	for(var i = 0; i < Math.PI * 2; i += Math.PI * 2 / density)
	{
		verticesTop.push(Math.sin(i), -height /2, Math.cos(i));
		verticesBottom.push(Math.sin(i), height / 2, Math.cos(i));
	}

	var upper = Math.PI * 2 + 1 * Math.PI * 2 / density;
	for(var i = 0; i < upper; i += Math.PI * 2 / density)
	{
		verticesSide.push(Math.sin(i), -height /2, Math.cos(i));
		verticesSide.push(Math.sin(i), height / 2, Math.cos(i));
	}

	var cylinderTopBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTopBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesTop), gl.STATIC_DRAW);
	cylinderTopBuffer.itemSize = 3;
	cylinderTopBuffer.numItems = verticesTop.length / 3;

	var cylinderBottomBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBottomBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesBottom), gl.STATIC_DRAW);
	cylinderBottomBuffer.itemSize = 3;
	cylinderBottomBuffer.numItems = verticesBottom.length / 3;

	var cylinderSideBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderSideBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesSide), gl.STATIC_DRAW);
	cylinderSideBuffer.itemSize = 3;
	cylinderSideBuffer.numItems = verticesSide.length / 3;

	var cylinderColorTopBuffer,
		cylinderColorSideBuffer,
		cylinderColorBottomBuffer;

	var topColorArr = [],
		bottomColorArr = [];
	for(var i = 0; i < cylinderTopBuffer.numItems; i++)
	{
		topColorArr.push(colorTop[0], colorTop[1], colorTop[2], colorTop[3]);
		bottomColorArr.push(colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);
	}

	var sideColorArr = [];
	for(var i = 0 ; i < cylinderSideBuffer.numItems ; i++)
	{
		sideColorArr.push(colorSide[0], colorSide[1], colorSide[2], colorSide[3]);
	}

	cylinderColorTopBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorTopBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(topColorArr), gl.STATIC_DRAW);
	cylinderColorTopBuffer.itemSize = 4;
	cylinderColorTopBuffer.numItems = cylinderTopBuffer.numItems;

	cylinderColorBottomBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorBottomBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bottomColorArr), gl.STATIC_DRAW);
	cylinderColorBottomBuffer.itemSize = 4;
	cylinderColorBottomBuffer.numItems = cylinderBottomBuffer.numItems;

	cylinderColorSideBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorSideBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sideColorArr), gl.STATIC_DRAW);
	cylinderColorSideBuffer.itemSize = 4;
	cylinderColorSideBuffer.numItems =  cylinderSideBuffer.numItems;

	var cylinder = {
		top: cylinderTopBuffer,
		bottom: cylinderBottomBuffer,
		side: cylinderSideBuffer,
		topColor: cylinderColorTopBuffer,
		bottomColor: cylinderColorBottomBuffer,
		sideColor: cylinderColorSideBuffer
	};

	return function(context){
		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.topColor);
		gl.vertexAttribPointer(context.shader.vertexColorAttribute, cylinder.topColor.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.top);
		gl.vertexAttribPointer(context.shader.vertexPositionAttribute, cylinder.top.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, cylinder.top.numItems);


		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.bottomColor);
		gl.vertexAttribPointer(context.shader.vertexColorAttribute, cylinder.topColor.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.bottom);
		gl.vertexAttribPointer(context.shader.vertexPositionAttribute, cylinder.bottom.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, cylinder.bottom.numItems);

		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.sideColor);
		gl.vertexAttribPointer(context.shader.vertexColorAttribute, cylinder.sideColor.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.side);
		gl.vertexAttribPointer(context.shader.vertexPositionAttribute, cylinder.side.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, cylinder.side.numItems);
	}
}
