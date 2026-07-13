const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();

  // Keep track of all API requests
  page.on('request', request => {
    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      console.log('API Request:', request.method(), request.url());
      if (request.method() === 'POST' || request.method() === 'PUT') {
        console.log('Post Data:', request.postData());
      }
      console.log('Headers:', request.headers());
    }
  });

  page.on('response', async response => {
    const req = response.request();
    if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
      console.log('API Response Status:', response.status(), req.url());
      try {
        const text = await response.text();
        console.log('Response Data:', text.substring(0, 500));
      } catch(e) {}
    }
  });

  console.log("Navigating to FAD...");
  await page.goto('https://fadpro.tn/#/auth/login', { waitUntil: 'networkidle2' });

  // Type login and password
  // Wait for an input field
  console.log("Waiting for inputs...");
  await page.waitForSelector('input[type="text"], input[formcontrolname="login"], input[name="username"]', {timeout: 5000}).catch(()=>console.log("No text input found"));
  
  // Dump the page HTML to see the login form
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('fad_login.html', html);
  console.log("Saved fad_login.html");

  await browser.close();
})();
