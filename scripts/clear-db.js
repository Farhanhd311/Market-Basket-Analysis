const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.stock.deleteMany().then(r => {
  console.log('Deleted', r.count, 'rows of Stock');
  return p.$disconnect();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
