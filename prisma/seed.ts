import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
const customer1 = await prisma.customer.create({
data: {
name: "John Doe",
email: "[john@example.com](mailto:john@example.com)",
phone: "9876543210",
},
});

const customer2 = await prisma.customer.create({
data: {
name: "Sarah Smith",
email: "[sarah@example.com](mailto:sarah@example.com)",
phone: "9876543211",
},
});

await prisma.order.createMany({
data: [
{
orderNumber: "ORD-1001",
productName: "Wireless Mouse",
amount: 50,
productType: ProductType.PHYSICAL,
delivered: true,
purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
customerId: customer1.id,
},
{
orderNumber: "ORD-1002",
productName: "React Course",
amount: 100,
productType: ProductType.DIGITAL,
delivered: true,
purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
customerId: customer1.id,
},
{
orderNumber: "ORD-1003",
productName: "Gaming Laptop",
amount: 1500,
productType: ProductType.PHYSICAL,
delivered: true,
purchaseDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
customerId: customer2.id,
},
{
orderNumber: "ORD-1004",
productName: "Keyboard",
amount: 80,
productType: ProductType.PHYSICAL,
delivered: true,
purchaseDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
customerId: customer2.id,
},
],
});
}

main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
console.error(e);
await prisma.$disconnect();
process.exit(1);
});
