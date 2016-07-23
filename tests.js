/** out */

QUnit.test( "lineMath 0 degree", function( assert ) {
  var A = [0,2], B = [0,0];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [0,1], B] );
});

QUnit.test( "lineMath 45 degree", function( assert ) {
  var A = [0,2], B = [2,0];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,1], B] );
});

QUnit.test( "lineMath 90 degree", function( assert ) {
  var A = [0,2], B = [2,2];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,2], B] );
});

QUnit.test( "lineMath 135 degree", function( assert ) {
  var A = [0,2], B = [2,4];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,3], B] );
});

/** in **/

QUnit.test( "lineMath 180 degree", function( assert ) {
  var A = [0,0], B = [0,2];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [0,1], B] );
});

QUnit.test( "lineMath 225 degree", function( assert ) {
  var A = [2,0], B = [0,2];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,1], B] );
});

QUnit.test( "lineMath 270 degree", function( assert ) {
  var A = [2,2], B = [0,2];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,2], B] );
});

QUnit.test( "lineMath 315 degree", function( assert ) {
  var A = [2,4], B = [0,2];
  var coords = lineMath(A, B);
  assert.deepEqual( coords, [A, [1,3], B] );
});
