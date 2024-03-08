import { BankAccount } from "../src/bank-account";
import axios from "axios"

// Quand je consulte mon solde, je veux avoir l'argent que je possède actuellement
// Quand je dépose de l'argent, le solde de mon compte augmente
// Quand je retire de l'argent, le solde de mon compte diminue
// Quand je veux voir l'historique de mon compte, je reçois la liste de mes transactions dans l'ordre décroissant

// Quand je transfère de l'argent à un autre compte avec un montant négatif je reçois un code 400
// Quand je transfère de l'argent à un autre compte avec des champs manquants je reçois un code 400
// Quand je transfère de l'argent à un autre compte avec un montant positif et tous les champs, je reçois un code 202

const todayDate = new Date(2024, 2, 8)
const yesterdayDate = new Date(2024, 2, 7)

describe('bank-account', () => {
  describe("getSolde", () => {
    test("Quand je consulte mon solde, je veux avoir l'argent que je possède actuellement", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      //THEN
      expect(bankAccount.getBalance()).toBe(0);
    })
    test("Quand je dépose de l'argent, le solde de mon compte augmente", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      //WHEN
      bankAccount.deposit(100)
      //THEN
      expect(bankAccount.getBalance()).toBe(100);
    })
    test("Quand je retire de l'argent, le solde de mon compte diminue", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      //WHEN
      bankAccount.withdraw(100)
      //THEN
      expect(bankAccount.getBalance()).toBe(-100);
    })
    test("Quand je veux voir l'historique de mon compte qui n'a aucune transaction, je reçois une liste vide", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      //WHEN
      const history = bankAccount.getHistory();
      //THEN
      expect(history).toStrictEqual([]);
    })
    test("Quand je dépose de l'argent sur mon compte et que je consulte mon historique, je peux voir la transaction dans l'historique", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      bankAccount.deposit(100);
      //WHEN
      const history = bankAccount.getHistory();
      //THEN
      expect(history).toStrictEqual([
        {
          date: "08/03/2024",
          amount: 100,
          balance: 100
        }
      ]);
    })
    test("Quand je retire de l'argent sur mon compte et que je consulte mon historique, je peux voir la transaction dans l'historique", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      bankAccount.withdraw(100);
      //WHEN
      const history = bankAccount.getHistory();
      //THEN
      expect(history).toStrictEqual([
        {
          date: "08/03/2024",
          amount: -100,
          balance: -100
        }
      ]);
    })
    test("Quand j'ajoute et je retire de l'argent sur mon compte et que je consulte mon historique, je peux voir les transactions dans l'historique", () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      bankAccount.deposit(100);
      bankAccount.withdraw(50);
      //WHEN
      const history = bankAccount.getHistory();
      //THEN
      expect(history).toStrictEqual([
        {
          date: "08/03/2024",
          amount: -50,
          balance: 50
        },
        {
          date: "08/03/2024",
          amount: 100,
          balance: 100
        }
      ]);
    })
    test("Quand j'ajoute de l'argent un jour, que je retire de l'argent le lendemain et que je consulte mon historique, je peux voir les transactions à des dates différentes", () => {
      //GIVEN
      const bankAccount = new BankAccount(yesterdayDate);
      bankAccount.deposit(50);
      bankAccount.setDate(todayDate)
      bankAccount.withdraw(100);
      //WHEN
      const history = bankAccount.getHistory();
      //THEN
      expect(history).toStrictEqual([
        {
          date: "08/03/2024",
          amount: -100,
          balance: -50
        },
        {
          date: "07/03/2024",
          amount: 50,
          balance: 50
        }
      ]);
    })
    test("Quand je transfère de l'argent à un autre compte avec un montant négatif je reçois un code 400", async () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      const amount = -100;
      const ibanFrom = "ibanFromnId"
      const ibanTo = "ibanToId"
      jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 400 })
      //WHEN
      const transferResult = await bankAccount.transfer(amount, ibanFrom, ibanTo);
      //THEN
      expect(axios.post).toHaveBeenCalledWith("https://api.bank.octo/transfer", {
        amount: -100,
        ibanFrom: "ibanFromnId",
        ibanTo: "ibanToId"
      })
      expect(transferResult).toStrictEqual(400);
    })
    test("Quand je transfère de l'argent à un autre compte avec un montant négatif je reçois un code 400", async () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      const amount = -100;
      const ibanFrom = "ibanFromnId"
      const ibanTo = "ibanToId"
      jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 400 })
      //WHEN
      const transferResult = await bankAccount.transfer(amount, ibanFrom, ibanTo);
      //THEN
      expect(axios.post).toHaveBeenCalledWith("https://api.bank.octo/transfer", {
        amount: -100,
        ibanFrom: "ibanFromnId",
        ibanTo: "ibanToId"
      })
      expect(transferResult).toStrictEqual(400);
    })
    test("Quand je transfère de l'argent à un autre compte avec un montant positif et tous les champs, je reçois un code 202", async () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      const amount = 100;
      const ibanFrom = "ibanFromnId"
      const ibanTo = "ibanToId"
      jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 202 })
      //WHEN
      const transferResult = await bankAccount.transfer(amount, ibanFrom, ibanTo);
      //THEN
      expect(axios.post).toHaveBeenCalledWith("https://api.bank.octo/transfer", {
        amount: 100,
        ibanFrom: "ibanFromnId",
        ibanTo: "ibanToId"
      })
      expect(transferResult).toStrictEqual(202);
    })
    test("Quand je demande la liste des transferts effectués vers des comptes extérieurs, je reçois un liste des transferts qui concernent ce compte", async () => {
      //GIVEN
      const bankAccount = new BankAccount(todayDate);
      const iban = "ibanId"
      jest.spyOn(axios, "get").mockResolvedValueOnce({
        data: [{
          at: todayDate,
          ibanFrom: "ibanFromId",
          ibanTo: iban,
          amount: 100
        }]
      })
      //WHEN
      const transfers = await bankAccount.getTransfers(iban);
      //THEN
      expect(axios.get).toHaveBeenCalledWith("https://api.bank.octo/transfer/ibanId")
      expect(transfers).toStrictEqual([{
        at: todayDate,
        ibanFrom: "ibanFromId",
        ibanTo: "ibanId",
        amount: 100
      }]);
    })
  })
})
