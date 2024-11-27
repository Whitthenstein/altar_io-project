import fs from "fs";

import dbJSON from "./db.json";

import { PaymentType } from "@common/types";

const database: Record<string, PaymentType[]> = dbJSON;

if (!database.payments) {
  const payments: PaymentType[] = [];
  database.payments = payments;
}

const saveToDisk = () =>
  fs.writeFileSync("./src/db.json", JSON.stringify(database));

const addPayment = (payment: PaymentType) => {
  database.payments.push(payment);
  console.log("Payments in memory: ", database.payments);
  saveToDisk();
};

export const db = { database, saveToDisk, addPayment };
