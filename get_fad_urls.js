const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('https://fadpro.tn/', { httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) });
    const match = res.data.match(/src=\"(main.*?\.js)\"/);
    if (match) {
      const js = await axios.get('https://fadpro.tn/' + match[1], { httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) });
      const urls = js.data.match(/https?:\/\/[^\"]+/g);
      if (urls) {
        console.log("URLs found in main.js:");
        console.log(urls.slice(0, 50).join('\n'));
      } else {
        console.log("No URLs found in main.js");
      }
    } else {
      console.log("main.js not found in HTML");
    }
  } catch(e) {
    console.error(e.message);
  }
}
test();
