fetch('http://cdgros.com/Site_CDG25/')
  .then(r => r.text())
  .then(t => {
    // Find form action and input fields
    const actionMatch = t.match(/<form[^>]+action="([^"]+)"/i);
    console.log('Action:', actionMatch ? actionMatch[1] : null);
    
    const inputs = [...t.matchAll(/<input[^>]+name="([^"]+)"[^>]*>/gi)].map(m => m[1]);
    console.log('Inputs:', inputs);
  })
  .catch(console.error);
