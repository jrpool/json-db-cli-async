/// Functions testing satisfaction of commonly required argument properties.

/// NONBLANK STRING

exports.isNonblankString = string =>
  string !== undefined && typeof string === 'string' && string.length;

/** BOUNDED INTEGER RANGE

  Function that returns whether the specified arguments are a valid
  specification of a range of integers, either unbounded or inclusively
  bounded on each end.
*/
exports.areIntRangeStrings = (string0, string1, min, max) => {
  if (string0 === undefined || string1 === undefined) {
    return false;
  }
  const int0 = Number.parseInt(string0);
  const int1 = Number.parseInt(string1);
  return Number.isInteger(int0) && Number.isInteger(int1)
    && (min === undefined || int0 >= min)
    && (max === undefined || int1 <= max)
    && int1 >= int0;
};
