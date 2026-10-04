import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  const reqCount = await p.request.count();
  const attCount = await p.attendance.count();
  const empCount = await p.employee.count();
  
  console.log('Counts — Requests:', reqCount, '| Attendance:', attCount, '| Employees:', empCount);
  
  if (reqCount > 0) {
    const items = await p.request.findMany({ take: 3, select: { id: true, type: true, status: true, employeeId: true } });
    console.log('Sample requests:', JSON.stringify(items, null, 2));
  }
  
  await p.$disconnect();
}

main().catch(console.error);
