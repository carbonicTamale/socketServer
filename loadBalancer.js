var LoadBalancer = function() {
  this.priorityQueue = [];
}

LoadBalancer.prototype.insert = function(processName) {
  var temp = this.priorityQueue[0];
  this.priorityQueue[0] = [processName, 0];
}

LoadBalancer.prototype.remove = function(processName) {

}

LoadBalancer.prototype.findMin = function() {
  return this.priorityQueue[0];
}

LoadBalancer.prototype.leftChild(i) = function() {
  return 2*i + 1;
}

LoadBalancer.prototype.leftChild(i) = function() {
  return 2*i + 2;
}

LoadBalancer.prototype.swapDirection(i, count) = function() {
  if( count > this.priorityQueue[this.leftChild(i)][0] ) {
    return this.leftChild(i);
  } else if( count > this.priorityQueue[this.rightChild(i)][0] ) {
    return this.rightChild(i);
  }
}

// when a user adds load to the process doing the least amount of work,
// make sure to increase the work count on the process and put process now doing
// the least amount of work to the top of the tree.
LoadBalancer.prototype.addLoadToBestProcess = function(processName) {
  var processTuple = this.findMin();
  processTuple[0]++;

  var index = 0;
  var direction = swapDirection(index, processTuple[0]);

  while(direction) {
    
  }
}

LoadBalancer.prototype.removeLoadFromProcess = function() {

}