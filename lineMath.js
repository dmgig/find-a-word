// http://stackoverflow.com/questions/13491676/get-all-pixel-coordinates-between-2-points
var lineMath = function(A, B){
    
  A = [Number(A[0]), Number(A[1])];
  B = [Number(B[0]), Number(B[1])];
    
  console.log(A);
  console.log(B);
    
  function slope(a, b) {
    if (a[0] == b[0]) {
      return null;
    }
    return (b[1] - a[1]) / (b[0] - a[0]);
  }

  function intercept(point, slope) {
      
    console.log(point)
    console.log(slope)
      
    if (slope === null) {
      // vertical line
      return point[0];
    }
    return point[1] - slope * point[0];
  }

  var m = slope(A, B);
  var b = intercept(A, m);

  console.log(m);
  console.log(b);

  var coordinates = [];
  for (var x = A[0]; x <= B[0]; x++) {
    var y = m * x + b;
    coordinates.push([x, y]);
  }
    
  return coordinates;
}
