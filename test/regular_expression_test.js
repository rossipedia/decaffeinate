import check from './support/check';

describe('regular expressions', () => {
  it('passes regular expressions through as-is', () => {
    check(`a = /foo\s/`, `let a = /foo\s/;`);
  });

  it('passes regular expressions with hash through as-is in an assignment context', () => {
    check(`a = /foo#\s/`, `let a = /foo#\s/;`);
  });

  it('passes regular expressions with hash through as-is in a function call context', () => {
    check(`a.a(/#/)`, `a.a(/#/);`);
  });

  it('rewrites block regular expressions as a RegExp call with a multiline string', () => {
    check(`
      a = ///
        foo .*
        bar
      ///
    `, `
      let a = new RegExp(\`\\
      foo.*\\
      bar\\
      \`);
    `);
  });

  it('preserves slash escapes in regular expressions', () => {
    check(`a = /foo\\/bar/`, `let a = /foo\\/bar/;`);
  });

  it('preserves regular expression flags', () => {
    check(`a = /a/ig`, `let a = /a/ig;`);
  });

  it('handles back-to-back escapes correctly', () => {
    check(`/\\/\\//`, `/\\/\\//;`);
  });

  it('escapes necessary characters in heregexes', () => {
    check(`///a/b\`c\${d\\e///`, `new RegExp(\`a/b\\\`c\\\${d\\\\e\`);`);
  });

  it('properly handles flags in heregexes', () => {
    check(`///a\nb///gi`, `new RegExp(\`a\\\nb\`, 'gi');`);
  });

  it('handles interpolations within heregexes', () => {
    check(`
      ///
        foo  # hello #{abc}d
        #{bar}
      ///g
    `, `
      new RegExp(\`\\
      foo\${abc}d\\
      \${bar}\\
      \`, 'g');
    `);
  });

  it('allows escaping spaces in heregexes', () => {
    check(`///a\\ b\\\tc\\\nd///`, `new RegExp(\`a b\tc\nd\`);`);
  });

  it('escapes \\u2028 within regexes', () => {
    check(`
      /\u2028/
      `, `
      /\\u2028/;
    `);
  });

  it('escapes \\u2029 within regexes', () => {
    check(`
      /\u2029/
      `, `
      /\\u2029/;
    `);
  });

  it('uses the existing escape character for escaped \\u2028 within regexes', () => {
    check(`
      /\\\u2028/
      `, `
      /\\u2028/;
    `);
  });

  it('leaves an escaped backslash when an escaped backslash is followed by \\u2028 within regexes', () => {
    check(`
      /\\\\\u2028/
      `, `
      /\\\\\\u2028/;
    `);
  });

  it('removes \\u2028 within heregexes', () => {
    check(`
      ///\u2028///
      `, `
      new RegExp(\`\`);
    `);
  });

  it('removes \\u2029 within heregexes', () => {
    check(`
      ///\u2029///
      `, `
      new RegExp(\`\`);
    `);
  });

  it('handles escaped \\u2028 within heregexes', () => {
    check(`
      ///\\\u2028///
      `, `
      new RegExp(\`\\u2028\`);
    `);
  });

  it('handles escaped \\u2029 within heregexes', () => {
    check(`
      ///\\\u2029///
      `, `
      new RegExp(\`\\u2029\`);
    `);
  });

  it('handles a double backslash followed by a space', () => {
    check(`
      ///\\\\[\\\\ ]///
      `, `
      new RegExp(\`\\\\\\\\[\\\\\\\\]\`);
    `);
  });
});
