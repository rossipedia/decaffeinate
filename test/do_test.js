import check from './support/check';

describe('`do`', () => {
  it('becomes a normal call expression when not given a function expression', () => {
    check(`do foo`, `foo();`);
  });
  
  it('creates an IIFE returning the last value', () => {
    check(`one = do -> 1`, `let one = (() => 1)();`);
  });

  it('creates an IIFE with bound functions', () => {
    check(`do => 1`, `(() => 1)();`);
  });

  it('creates an IIFE with shadowed arguments', () => {
    check(`do (i) -> i`, `(i => i)(i);`);
  });

  it('creates an IIFE with explicit bindings', () => {
    check(`do (i=1) -> i`, `(i => i)(1);`);
  });

  it('creates an IIFE with object destructuring', () => {
    check(`do ({i}) -> i`, `(({i}) => i)({i});`);
  });

  it('creates an IIFE with array destructuring', () => {
    check(`do ([a]) -> a`, `(([a]) => a)([a]);`);
  });

  it('create a multi-line IIFE', () => {
    check(`
      do (i, n=0) ->
        result = i + n
        result
    `, `
      (function(i, n) {
        let result = i + n;
        return result;
      })(i, 0);
    `);
  });

  it('creates a multi-line IIFE surrounded by parentheses', () => {
    check(`
      (do ->
        a = 1
        b = a) + 1
    `, `
      (function() {
        let b;
        let a = 1;
        return b = a;
      }()) + 1;
    `);
  });

  it('allows an assignment within a do operation on a fat arrow function (#784)', () => {
    check(`
      do a = =>
        b
    `, `
      let a;
      (a = () => {
        return b;
      })();
    `);
  });

  it('allows an assignment within a do operation with defaults (#637)', () => {
    check(`
      do a = (b = c, d) ->
        e
    `, `
      let a;
      (a = (b, d) => e)(c, d);
    `);
  });

  it('properly converts do expressions on a normal assignment', () => {
    check(`
      do a = b
    `, `
      let a;
      (a = b)();
    `);
  });

  it('properly converts negated do expressions', () => {
    check(`
      do !a
    `, `
      (!a)();
    `);
  });
});
