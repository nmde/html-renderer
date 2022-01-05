// Copyright (c) 2011, Chris Umbel, James Coglan
// This file is required in order for any other classes to work. Some Vector methods work with the
// other Sylvester classes and are useless unless they are included. Other classes such as Line and
// Plane will not function at all without Vector being loaded first.

Math.sign = function sign(x) {
  return x < 0 ? -1 : 1;
};

export default {
  approxPrecision: 1e-5,
  precision: 1e-6,
};
