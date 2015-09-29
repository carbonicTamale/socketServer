var expect = require('chai').expect;
var request = require('supertest');
var loadBalancer = require('../loadBalancer.js');

describe('Load Balancer', function () {
  beforeEach(function() {
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
    expect(loadBalancer.findMin()[0]).to.equal('truffle');
    done();
  });

  it('should correctly remove load from a process and reorganize tree' , function (done) {
    console.log(loadBalancer);
    loadBalancer.removeLoadFromProcess('poultry');
    loadBalancer.removeLoadFromProcess('steak');
    console.log(loadBalancer);

    done();
  });
});

