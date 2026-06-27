const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.deleteMany().then(r => {
  console.log('Deleted', r.count, 'rows');
  return p.$disconnect();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
