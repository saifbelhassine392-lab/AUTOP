fetch('https://fadpro.tn/')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/src="([^"]*main[^"]*\.js)"/);
    if (match) {
      console.log('Found JS:', match[1]);
      fetch('https://fadpro.tn/' + match[1])
        .then(r => r.text())
        .then(js => {
          const urls = js.match(/https?:\/\/[^\s"']+/g);
          if (urls) {
            const apiUrls = urls.filter(u => u.includes('api') || u.includes('fad'));
            console.log('API URLs:', [...new Set(apiUrls)].slice(0, 20));
          } else {
            console.log('no urls found');
          }
        });
    } else {
      console.log('no main js');
    }
  })
  .catch(console.error);
