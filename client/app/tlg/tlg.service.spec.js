'use strict';

describe('Service: tlg', function () {

  // load the service's module
  beforeEach(module('telusLg2App'));

  // instantiate service
  var tlg;
  beforeEach(inject(function (_tlg_) {
    tlg = _tlg_;
  }));

  it('should do something', function () {
    expect(!!tlg).toBe(true);
  });

});
