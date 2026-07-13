const axios = require('axios');

async function testPost() {
  try {
    const res = await axios.post('http://localhost:3000/api/suppliers', {
      name: "TEST VERCEL",
      contactName: "TEST",
      phone: "123",
      email: "test@test.com",
      address: "123 Test",
      city: "TestCity",
      b2bUrl: "https://b2bsteq.com/",
      b2bLogin: "CL0016035",
      b2bPassword: "STEQ484630925"
    }, {
      headers: {
        'Cookie': 'next-auth.session-token=' // We don't have a valid session token here... wait, we need one!
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

testPost();
