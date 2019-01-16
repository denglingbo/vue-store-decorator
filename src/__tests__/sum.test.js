it('adds 1 + 2 to equal 3 in TScript', () => {
  const sum = require('../demo/sum.ts').default;
  expect(sum(1, 2)).toBe(3);
});

it('number tofixed 2', () => {
  const test = require('../demo/sum.ts').number2;
  expect(test(2)).toBe('2.00');
});

