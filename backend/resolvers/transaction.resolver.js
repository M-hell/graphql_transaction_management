import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";

const transactionResolver = {
	Query: {
		transactions: async (_, __, context) => {
			try {
				if (!context.getUser()) throw new Error("Unauthorized");
				const userId = await context.getUser()._id;

				const transactions = await Transaction.find({ userId });
				return transactions;
			} catch (err) {
				console.error("Error getting transactions:", err);
				throw new Error("Error getting transactions");
			}
		},
		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId);
				return transaction;
			} catch (err) {
				console.error("Error getting transaction:", err);
				throw new Error("Error getting transaction");
			}
		},
		categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized");

			const userId = context.getUser()._id;
			const transactions = await Transaction.find({ userId });
			const categoryMap = {};

			// const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		},
	},
	Mutation: {
		createTransaction: async (_, { input }, context) => {
			try {
				const newTransaction = new Transaction({
					...input,
					userId: context.getUser()._id,
				});
				await newTransaction.save();
				return newTransaction;
			} catch (err) {
				console.error("Error creating transaction:", err);
				throw new Error("Error creating transaction");
			}
		},
		updateTransaction: async (_, { input }) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
					new: true,
				});
				return updatedTransaction;
			} catch (err) {
				console.error("Error updating transaction:", err);
				throw new Error("Error updating transaction");
			}
		},
		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
				return deletedTransaction;
			} catch (err) {
				console.error("Error deleting transaction:", err);
				throw new Error("Error deleting transaction");
			}
		},
		getAIResponse: async (_, __, context) => {
			try {
			  // 1. Get all transactions for the authenticated user
			  const userId = context.getUser()._id;
			  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
			  
			  if (!transactions || transactions.length === 0) {
				return "No transactions found. Start by adding some transactions to get financial advice.";
			  }
	  
			  // 2. Prepare transaction summary for AI
			  const transactionSummary = transactions.map(t => ({
				description: t.description,
				amount: t.amount,
				category: t.category,
				paymentType: t.paymentType,
				date: t.date.toISOString().split('T')[0]
			  }));
	  
			  // 3. Calculate some basic statistics
			  const totalExpenses = transactions
				.filter(t => t.category === 'expense')
				.reduce((sum, t) => sum + t.amount, 0);
			  
			  const totalSavings = transactions
				.filter(t => t.category === 'saving')
				.reduce((sum, t) => sum + t.amount, 0);
	  
			  // 4. Create prompt for Gemini
			  const prompt = `
			  Analyze these financial transactions and provide personalized advice:
			  
			  Transaction History:
			  ${JSON.stringify(transactionSummary, null, 2)}
			  
			  Key Statistics:
			  - Total Expenses: $${totalExpenses.toFixed(2)}
			  - Total Savings: $${totalSavings.toFixed(2)}
			  
			  Please provide specific recommendations on:
			  1. How to better manage expenses based on spending patterns
			  2. Debt management strategies if applicable
			  3. How to optimize savings based on current habits
			  4. General financial health improvement tips
			  5. Any red flags in spending behavior
			  
			  Make the advice practical and actionable. Don't mention that you're an AI - present it as financial insights.
			  `;

			  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	  
			  // 5. Get response from Gemini
			  const response = await ai.models.generateContent({
				model: "gemini-2.0-flash",
				contents: prompt,
			  });
	  
			  return response.text;
			} catch (err) {
			  console.error("Error generating AI response:", err);
			  return "Unable to generate financial advice at this time. Please try again later.";
			}
		  }
	},
	Transaction: {
		user: async (parent) => {
			const userId = parent.userId;
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error getting user:", err);
				throw new Error("Error getting user");
			}
		},
	},
};

export default transactionResolver;