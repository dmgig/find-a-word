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
  
  var swapped = false;
  if (A[0] > B[0] || A[1] > B[1]){
    var A2, B2;
    swapped = true;
    B2 = [A[0], A[1]];
    A2 = [B[0], B[1]];
    A = A2; B = B2;
  }

  var coordinates = [];
  if(A[0] != B[0]){
    for (x = A[0]; x <= B[0]; x++) {
      var y = m * x + b;
      coordinates.push([x, y]);
    }
  }else{
    for (y = A[1]; y <= B[1]; y++) {
      coordinates.push([A[0], y]);
    }    
  }

  if(swapped)
    coordinates.reverse();
    
  return coordinates;
}
