var expect = require('chai').expect;
var request = require('supertest');
var loadBalancer = require('../loadBalancer.js');

describe('Load Balancer', function () {
  beforeEach(function() {
    loadBalancer.priorityQueue = [];
    loadBalancer.processHash = {};
    loadBalancer.insert('truffle');
    loadBalancer.insert('steak');
    loadBalancer.insert('poultry');
  });

  it('should correctly add new process and prioritize them', function (done) {
    expect(loadBalancer.findMin()[0]).to.equal('poultry');
    loadBalancer.insert('salmon');
    expect(loadBalancer.findMin()[0]).to.equal('salmon');
    done();
  });

  it('should correctly track the load on processes and reorder tree based on load' , function (done) {
    loadBalancer.addLoadToBestProcess();
    loadBalancer.addLoadToBestProcess();
    loadBalancer.addLoadToBestProcess();
    loadBalancer.addLoadToBestProcess();
    expect(loadBalancer.findMin()[0]).to.equal('poultry');
    done();
  });

  it('should correctly remove load from a process and reorganize tree' , function (done) {
    loadBalancer.removeLoadFromProcess('poultry');
    loadBalancer.removeLoadFromProcess('steak');

    done();
  });
});

