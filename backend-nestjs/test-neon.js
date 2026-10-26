"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Testing connection to Neon PostgreSQL...');
    const branches = await prisma.branch.findMany();
    console.log('Successfully queried Neon branches:', branches.map((b) => ({ id: b.id, name: b.name })));
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
    console.log('Successfully queried Neon users:', users);
}
main()
    .catch((e) => {
    console.error('Connection failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-neon.js.map