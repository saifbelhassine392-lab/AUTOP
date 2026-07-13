const loginData = { identity: "3905", password: "7S@5512g" };
async function testCol(col) {
  const r = await fetch(`https://pb.fadpro.tn/api/collections/${col}/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });
  const data = await r.json();
  console.log(col, r.status, data.code);
}
testCol('clients').then(()=>testCol('customers')).then(()=>testCol('users')).then(()=>testCol('_superusers'));
