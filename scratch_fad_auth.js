const loginData = { identity: "3905", password: "7S@5512g" };
fetch('https://pb.fadpro.tn/api/collections/users/auth-with-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
