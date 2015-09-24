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

LoadBalancer.prototype.rightChild(i) = function() {
  return 2*i + 2;
}

LoadBalancer.prototype.swapDirection(i, count) = function() {
  if( count > this.priorityQueue[this.leftChild(i)][1] ) {
    return 'left';
  } else if( count > this.priorityQueue[this.rightChild(i)][1] ) {
    return 'right';
  }
}

LoadBalancer.prototype.swapIndicesOnArray= function(idx1, idx2, array) {
  var temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
}

// when a user adds load to the process doing the least amount of work,
// make sure to increase the work count on the process and put process now doing
// the least amount of work to the top of the tree.
LoadBalancer.prototype.addLoadToBestProcess = function(processName) {
  var processTuple = this.findMin();
  processTuple[0]++;

  var index = 0;
  var direction = swapDirection(index, processTuple[1]);

  while(direction) {
    var swapIdx;

    if(direction === 'left'){
      swapIdx = leftChild(index);
    }
    else {
      swapIdx = rightChild(index);
    }

    swapIndicesOnArray(index, swapIdx, this.priorityQueue);
    index = swapIdx;

    direction = swapDirection(index, processTuple[1]);
  }

  return processTuple[0];
}

LoadBalancer.prototype.removeLoadFromProcess = function(processName) {
  var recurseDFS = function(index) {
    var curProcess = this.priorityQueue[index];
    if(curProcess[0] === processName) {
      curProcess[1]++;
      return true;
    }

    var leftSwap = this.leftChild(index)]);
    var rightSwap = this.rightChild(index);
    var child;

    if(recurseDFS(leftSwap)) {
      if(this.priorityQueue[leftSwap][1] < curProcess[1]) {
        swapIndicesOnArray(index, leftSwap, this.indicesArray);
        return true;
      }
    }
    else if(recurseDFS(rightSwap)) {
      if(this.priorityQueue[rightSwap][1] < curProcess[1]) {
        swapIndicesOnArray(index, rightSwap, this.indicesArray);
        return true;
      }
    }

    return false;
  }

  recurseDFS(0);
}