const solve = require('kmap-solver-lib');

const variables = ['x', 'y', 'z'];
const minterms = [0, 1, 3, 4, 5, 6];

console.log(solve(variables, minterms));
