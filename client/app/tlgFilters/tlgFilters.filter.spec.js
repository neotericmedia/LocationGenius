'use strict';

describe('Filter: tlgFilters', function () {

  // load the filter's module
  beforeEach(module('telusLg2App'));

  // initialize a new instance of the filter before each test
  var tlgFilters;
  beforeEach(inject(function ($filter) {
    tlgFilters = $filter('tlgFilters');
  }));

  it('should return the input prefixed with "tlgFilters filter:"', function () {
    var text = 'angularjs';
    expect(tlgFilters(text)).toBe('tlgFilters filter: ' + text);
  });

});
