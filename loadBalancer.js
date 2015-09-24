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

LoadBalancer.prototype.addLoadToProcess = function(processName) {
  var target = processName;
  var start = this.priorityQueue[0];

  while(target !== start[0]) {

  }

  recursiveDFS(target, start);
}

LoadBalancer.prototype.removeLoadFromProcess = function() {

}