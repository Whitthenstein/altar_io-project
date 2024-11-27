import CodeComponent from "./CodeComponent";
import { useGeneratorStore } from "../store/generatorStore";
import Input from "./Input";
import useWebSocket from "../hooks/useWebSocket";
import { useEffect, useState } from "react";
import { PaymentType } from "@common/types";
import { usePaymentStore } from "../store/paymentsStore";

import "./PaymentsPage.css";

const PaymentsPage = () => {
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const isConnected = useGeneratorStore((state) => state.isConnected);
  const addPayment = usePaymentStore((state) => state.addPayment);
  const setPayments = usePaymentStore((state) => state.setPayments);
  const payments = usePaymentStore((state) => state.payments);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (paymentName.length !== 0 && paymentAmount !== 0) {
      setIsAddButtonDisabled(false);
    }
  }, [paymentName, paymentAmount]);

  useEffect(() => {
    if (socket) {
      socket.on("new-payment", (payment: PaymentType) => {
        addPayment(payment);
      });

      socket.on("all-payments", (payments: PaymentType[]) => {
        setPayments(payments);
      });
    }
  }, [socket, addPayment, setPayments]);

  const onAdd = () => {
    socket.emit("payment", paymentName.trim(), paymentAmount);
  };

  const getPaymentName = (name: string) => {
    setPaymentName(name);
  };

  const getPaymentAmount = (amount: string) => {
    setPaymentAmount(Number(amount));
  };

  return (
    <div className="container">
      <CodeComponent />
      <div className="top_section_container">
        <Input
          type="text"
          title="PAYMENT"
          placeholder="Payment"
          onChangeFromProps={getPaymentName}
        />
        <Input
          type="number"
          title="AMOUNT"
          placeholder="Amount"
          onChangeFromProps={getPaymentAmount}
        />
        <button disabled={isAddButtonDisabled} onClick={onAdd}>
          + ADD
        </button>
      </div>
      <div>
        <h3>PAYMENT LIST</h3>
        <table className="payments_table">
          <thead>
            <tr className="payments_row">
              <th className="table_cell">NAME</th>
              <th className="table_cell">AMOUNT</th>
              <th className="table_cell">CODE</th>
              <th className="table_cell">GRID</th>
            </tr>
          </thead>
          <tbody>
            {isConnected &&
              payments.map((payment, index) => {
                return (
                  <tr className="payments_row" key={`${payment.name}:${index}`}>
                    <td className="table_cell">{payment.name}</td>
                    <td className="table_cell">{payment.amount}</td>
                    <td className="table_cell">{payment.code}</td>
                    <td className="table_cell">{payment.grid!.length * 10}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
