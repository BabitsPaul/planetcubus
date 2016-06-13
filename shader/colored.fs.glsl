precision mediump float;

//interpolate argument between vertex and fragment shader
varying vec4 v_color;

//entry point again
void main() {
  //gl_FragColor ... magic output variable containg the final 4D color of the fragment

  //we use the provided interpolated color from our three vertices
  gl_FragColor = v_color;
}
