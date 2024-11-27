import { create } from "zustand";
import { PaymentType } from "@common/types";

type PaymentStore = {
  payments: PaymentType[];
  addPayment: (payment: PaymentType) => void;
  setPayments: (payments: PaymentType[]) => void;
};

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  addPayment: (payment: PaymentType) => {
    const state = get();
    set({ payments: [...state.payments, payment] });
  },
  setPayments: (newPayments: PaymentType[]) => {
    console.log("storing payments");
    set({ payments: newPayments });
  },
}));
