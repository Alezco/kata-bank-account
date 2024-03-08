import axios from "axios"

type Transaction = {
  date: string;
  amount: number;
  balance: number;
}

type ExternalTransfer = {
  at: Date;
  ibanFrom: string;
  ibanTo: string;
  amount: number;
}

export class BankAccount {
  private balance = 0;
  private history: Transaction[] = [];

  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  public getBalance = (): number => {
    return this.balance;
  }

  public deposit = (amount: number): void => {
    this.balance += amount;
    this.history.unshift({
      date: this.date.toLocaleDateString(),
      amount,
      balance: this.getBalance()
    })
  }

  public withdraw = (amount: number): void => {
    this.balance -= amount;
    this.history.unshift({
      date: this.date.toLocaleDateString(),
      amount: -amount,
      balance: this.getBalance()
    })
  }

  public getHistory = (): Transaction[] => {
    return this.history;
  }

  public setDate = (date: Date): void => {
    this.date = date
  }

  public transfer = async (amount: number, ibanFrom: string, ibanTo: string): Promise<number> => {
    const response = await axios.post("https://api.bank.octo/transfer", {
      amount,
      ibanFrom,
      ibanTo
    });
    return response.status;
  }

  public getTransfers = async (iban: string): Promise<ExternalTransfer[]> => {
    const response = await axios.get(`https://api.bank.octo/transfer/${iban}`);
    return response.data;
  }
}
