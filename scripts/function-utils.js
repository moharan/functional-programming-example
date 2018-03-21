// first functional utility, it creates another function
// which will take the property from the object and return it
const prop = property => x => x[property];
// second functional utility, it creates another function
// which takes a predicate function to remove every element which does not
// match the current condition
const filter = fn => xs => xs.filter(fn);
// third functional utility, it creates another function to map
// with a transform function the current list to something else
const map = fn => xs => xs.map(fn);
// fourth functional utility, it executes the fn function for every element on the list
const forEach = fn => xs => xs.forEach(fn);
// compose fancyness
const compose = (...fns) => x => fns.reduceRight((acc, nextFn) => nextFn(acc), x);
// isolate the message stuff
const log = message => x => (console.log(message, x), x);
// to execute something impure in middle of a mapping
const executeImpure = fn => x => (fn(), x);

module.exports = { prop, filter, map, forEach, compose, log, executeImpure };
