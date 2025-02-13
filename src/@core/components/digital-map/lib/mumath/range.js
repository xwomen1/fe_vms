// The MIT License (MIT)

// Copyright (c) 2016 angus croll

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/*
  range(0, 5); // [0, 1, 2, 3, 4]
  range(5); // [0, 1, 2, 3, 4]
  range(-5); // [0, -1, -2, -3, -4]
  range(0, 20, 5) // [0, 5, 10, 15]
  range(0, -20, -5) // [0, -5, -10, -15]
*/

export default function range(start, stop, step) {
  if (start != null && typeof start != 'number') {
    throw new Error('start must be a number or null');
  }
  if (stop != null && typeof stop != 'number') {
    throw new Error('stop must be a number or null');
  }
  if (step != null && typeof step != 'number') {
    throw new Error('step must be a number or null');
  }
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (step == null) {
    step = stop > start ? 1 : -1;
  }
  var toReturn = [];
  var increasing = start < stop; //← here’s the change
  for (; increasing ? start < stop : start > stop; start += step) {
    toReturn.push(start);
  }

  return toReturn;
}