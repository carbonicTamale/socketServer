// var child_process = require('child_process');

// var processHash = {};
// processHash['proc1'] = child_process.fork('./child.js', ['proc1']);
// processHash['proc2'] = child_process.fork('./child.js', ['proc2']);

var LoadBalancer = function() {
  this.priorityQueue = [];

  // this.insert('proc1');
  // this.insert('proc2');
}

LoadBalancer.prototype.closeAllProcesses = function() {
  for(processName in processHash) {
    processHash[processName].kill();
  }
}

LoadBalancer.prototype.emit = function(data, room, socket) {
  var processToUse = this.addLoadToBestProcess();

  //processHash[processToUse].send('socket', [data, room, socket]);

  loadBalancer.removeLoadFromProcess(processToUse);
}

LoadBalancer.prototype.insert = function(processName) {
  // perform dirty insert on the heap data structure
  var lastOpenIdx = this.priorityQueue.length;
  var processTuple = [processName, 0];
  this.priorityQueue[lastOpenIdx] = processTuple;

  // bubble the newly created process up the heap until it is at the top,
  // adjusting the position of processes already in the heap accordingly
  var recurseInsert = function(index, processTuple) {
    var parentIndex = this.parent(index);

    // base case to stop the insertion when we have reached the parent
    if(parentIndex < 0) {
      // this.priorityQueue[index] = processTuple;
      return;
    }

    var temp = this.priorityQueue[parentIndex];
    this.priorityQueue[parentIndex] = processTuple;
    this.priorityQueue[index] = temp;

    recurseInsert.call(this, parentIndex, processTuple);
  }

  recurseInsert.call(this, lastOpenIdx, processTuple);
}

LoadBalancer.prototype.promoteSubtree = function(index) {
  var leftIndex = this.leftChild(index);
  var rightIndex = this.rightChild(index);
  var leftChild = this.priorityQueue[leftIndex];
  var rightChild = this.priorityQueue[rightIndex];

  if(leftChild && rightChild ) {
    if(leftChild[1] <= rightChild[1]) {
      this.priorityQueue[index] = leftChild;
      this.promoteSubtree(leftIndex);
    }
    else {
      this.priorityQueue[index] = rightChild;
      this.promoteSubtree(rightIndex);
    }
  }
  else if(leftChild) {
    this.priorityQueue[index] = leftChild;
    this.promoteSubtree(leftIndex);
  }
  else if(rightChild) {
    this.priorityQueue[index] = rightChild;
    this.promoteSubtree(rightIndex);
  }
  else {
    // the index has no children, delete it from the array
    delete this.priorityQueue[index];
  }
}

LoadBalancer.prototype.remove = function(processName) {
  var recurseDFS = function(name, index) {
    var proc = this.priorityQueue[index];

    if(proc[0] === processName) {
      this.promoteSubtree(index);
    }
    else {
      var leftIndex = this.leftChild(index);
      var rightIndex = this.rightChild(index);

      if(this.priorityQueue[leftIndex] !== undefined) {
        recurseDFS.call(this, name, leftIndex);
      }

      if(this.priorityQueue[rightIndex] !== undefined) {
        recurseDFS.call(this, name, rightIndex);
      }
    }
  }

  recurseDFS.call(this, processName, 0)
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

LoadBalancer.prototype.parent = function(i) {
  return Math.floor((i-1)/2);
}

LoadBalancer.prototype.swapDirection = function(i, count) {
  if( this.priorityQueue[i] !== undefined ) {
    if( this.priorityQueue[this.leftChild(i)] && count > this.priorityQueue[this.leftChild(i)][1] ) {
      return 'left';
    } else if( this.priorityQueue[this.rightChild(i)] && count > this.priorityQueue[this.rightChild(i)][1] ) {
      return 'right';
    }
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

      // if cur process drops below 0 load, free process up
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

// mod.insert('blaine');
// mod.insert('bowen');
// mod.insert('tim');
// mod.insert('test');
// mod.insert('test2');

module.exports = mod;