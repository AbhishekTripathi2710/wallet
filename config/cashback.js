// Cashback percentages by product category
const cashbackPercentages = {
  A: 10, // 10% cashback for Category A products
  B: 2,  // 2% cashback for Category B products
  C: 7   // 7% cashback for Category C products
};

// Maximum percentage of wallet balance that can be used for a purchase
const maxWalletUsagePercentage = 90; // 90% of wallet balance can be used for a purchase

module.exports = {
  cashbackPercentages,
  maxWalletUsagePercentage
}; 