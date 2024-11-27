import fs from "fs";

import { PaymentType } from "@common/types";

const dbFilePath = "./src/storage/db.json";
const payments: PaymentType[] = [];

type Database = {
  payments: PaymentType[];
  saveToDisk: () => void;
  addPayment: (payment: PaymentType) => void;
};

try {
  fs.accessSync(dbFilePath);
} catch (error) {
  console.log("Creating a database file...");
  fs.writeFileSync(dbFilePath, JSON.stringify({ payments }));
}

const dbJSON = JSON.parse(fs.readFileSync(dbFilePath).toString());
const database: Database = dbJSON;

if (!database.payments) {
  database.payments = payments;
}

database.saveToDisk = () =>
  fs.writeFileSync(dbFilePath, JSON.stringify(database));

database.addPayment = (payment: PaymentType) => {
  database.payments.push(payment);
  console.log("Payments in memory: ", database.payments);
  database.saveToDisk();
};

export default database;
