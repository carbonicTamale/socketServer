var child_process = require('child_process');

var processHash = {};
processHash['proc1'] = child_process.fork('./child.js', ['proc1']);
processHash['proc2'] = child_process.fork('./child.js', ['proc2']);

var LoadBalancer = function() {
  this.priorityQueue = [];

  this.insert('proc1');
  this.insert('proc2');
}

LoadBalancer.prototype.closeAllProcesses = function() {
  console.log('log');

  for(processName in processHash) {
    processHash[processName].kill();
  }
}

LoadBalancer.prototype.emit = function(data, room, socket) {
  var processToUse = this.addLoadToBestProcess();
  processHash[processToUse].send('socket', data, room, socket);
  loadBalancer.removeLoadFromProcess(processToUse);
}

LoadBalancer.prototype.insert = function(processName) {
  var temp = this.priorityQueue[0];
  this.priorityQueue[0] = [processName, 0];

  var recurseInsert = function(index, processTuple) {
    if(processTuple === undefined) {
      return;
    }

    if(index > this.priorityQueue.length) {
      return;
    }
    else if(index === this.priorityQueue.length) {
      this.priorityQueue[this.priorityQueue.length] = processTuple;
      return;
    }

    // obtain the closest relative value equal to 2^n
    var topExp = this.priorityQueue.length;
    while( (topExp & (topExp - 1)) !== 0 || topExp === 1) {
      topExp++;
    }

    var belowExp = this.priorityQueue.length - 1;
    while( (belowExp & (belowExp - 1)) !== 0 && belowExp !== 0) {
      belowExp--;
    }
    //

    var relativeWidth = topExp - belowExp;
    var relativeDistance = this.priorityQueue.length - belowExp;

    if( relativeDistance > relativeWidth/2) {
      var rightSwap = this.rightChild(index);
      var temp = this.priorityQueue[rightSwap];
      this.priorityQueue[rightSwap] = processTuple;
      recurseInsert.call(this, rightSwap, temp);
    } else {
      var leftSwap = this.leftChild(index);
      var temp = this.priorityQueue[leftSwap];
      this.priorityQueue[leftSwap] = processTuple;
      recurseInsert.call(this, leftSwap, temp);
    }
  }

  recurseInsert.call(this, 0, temp);
}

LoadBalancer.prototype.remove = function(processName) {
  recurseDFS()
}

LoadBalancer.prototype.findMin = function() {
  return this.priorityQueue[0];
}

LoadBalancer.prototype.leftChild = function(i) {
  return 2*i + 1;
}

LoadBalancer.prototype.rightChild = function(i) {
  return 2*i + 2;
}

LoadBalancer.prototype.swapDirection = function(i, count) {
  if( this.leftChild(i) < this.priorityQueue.length && count > this.priorityQueue[this.leftChild(i)][1] ) {
    return 'left';
  } else if( this.rightChild(i) < this.priorityQueue.length && count > this.priorityQueue[this.rightChild(i)][1] ) {
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
LoadBalancer.prototype.addLoadToBestProcess = function() {
  var processTuple = this.findMin();
  processTuple[1]++;

  var index = 0;
  var direction = this.swapDirection(index, processTuple[1]);

  while(direction) {
    var swapIdx;

    if(direction === 'left'){
      swapIdx = this.leftChild(index);
    }
    else {
      swapIdx = this.rightChild(index);
    }

    this.swapIndicesOnArray(index, swapIdx, this.priorityQueue);
    index = swapIdx;

    direction = this.swapDirection(index, processTuple[1]);
  }

  return processTuple[0];
}

LoadBalancer.prototype.removeLoadFromProcess = function(processName) {
  var recurseDFS = function(index) {
    var curProcess = this.priorityQueue[index];
    if(curProcess[0] === processName) {
      curProcess[1]--;
      return true;
    }

    var leftSwap = this.leftChild(index);
    var rightSwap = this.rightChild(index);

    if(recurseDFS.call(this, leftSwap)) {
      if(this.priorityQueue[leftSwap][1] < curProcess[1]) {
        this.swapIndicesOnArray.call(this, index, leftSwap, this.priorityQueue);
        return true;
      }
    }
    else if(recurseDFS.call(this, rightSwap)) {
      if(this.priorityQueue[rightSwap][1] < curProcess[1]) {
        this.swapIndicesOnArray.call(this, index, rightSwap, this.priorityQueue);
        return true;
      }
    }

    return false;
  }

  recurseDFS.call(this, 0);
}

var mod = new LoadBalancer();

module.exports = mod;