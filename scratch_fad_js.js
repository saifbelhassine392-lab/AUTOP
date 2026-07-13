fetch('https://fadpro.tn/')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/src="([^"]*main[^"]*\.js)"/);
    if (match) {
      fetch('https://fadpro.tn/' + match[1])
        .then(r => r.text())
        .then(js => {
          const pbMatch = js.match(/.{0,50}auth-with-password.{0,50}/g);
          console.log(pbMatch);
          const colMatch = js.match(/collection\([^)]+\)/g);
          console.log([...new Set(colMatch)]);
        });
    }
  })
  .catch(console.error);
