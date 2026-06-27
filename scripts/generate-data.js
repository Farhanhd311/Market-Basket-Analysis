const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'data', 'transactions.csv');

const products = [
  // Personal Care
  { name: "Soap", id: "PC001", category: "Personal Care", price: 15.00 },
  { name: "Shampoo", id: "PC002", category: "Personal Care", price: 35.00 },
  { name: "Toothpaste", id: "PC003", category: "Personal Care", price: 12.00 },
  { name: "Toothbrush", id: "PC004", category: "Personal Care", price: 10.00 },
  { name: "Face Wash", id: "PC005", category: "Personal Care", price: 25.00 },
  { name: "Body Lotion", id: "PC006", category: "Personal Care", price: 40.00 },
  
  // Household
  { name: "Detergent", id: "HH001", category: "Household", price: 30.00 },
  { name: "Floor Cleaner", id: "HH002", category: "Household", price: 20.00 },
  { name: "Dishwashing Liquid", id: "HH003", category: "Household", price: 18.00 },
  { name: "Tissue", id: "HH004", category: "Household", price: 8.00 },
  { name: "Toilet Paper", id: "HH005", category: "Household", price: 12.00 },
  
  // Bakery
  { name: "Bread", id: "BK001", category: "Bakery", price: 15.00 },
  { name: "Croissant", id: "BK002", category: "Bakery", price: 18.00 },
  { name: "Cookies", id: "BK003", category: "Bakery", price: 12.00 },
  { name: "Pastry", id: "BK004", category: "Bakery", price: 15.00 },
  { name: "Cake", id: "BK005", category: "Bakery", price: 45.00 },
  
  // Dairy & Eggs
  { name: "Milk", id: "DE001", category: "Dairy & Eggs", price: 20.00 },
  { name: "Butter", id: "DE002", category: "Dairy & Eggs", price: 25.00 },
  { name: "Cheese", id: "DE003", category: "Dairy & Eggs", price: 30.00 },
  { name: "Eggs", id: "DE004", category: "Dairy & Eggs", price: 18.00 },
  { name: "Yogurt", id: "DE005", category: "Dairy & Eggs", price: 15.00 },
  
  // Beverages
  { name: "Tea", id: "BV001", category: "Beverages", price: 10.00 },
  { name: "Coffee", id: "BV002", category: "Beverages", price: 25.00 },
  { name: "Soda", id: "BV003", category: "Beverages", price: 8.00 },
  { name: "Juice", id: "BV004", category: "Beverages", price: 15.00 },
  { name: "Bottled Water", id: "BV005", category: "Beverages", price: 5.00 },
  
  // Snacks
  { name: "Chips", id: "SN001", category: "Snacks", price: 10.00 },
  { name: "Chocolate", id: "SN002", category: "Snacks", price: 15.00 },
  { name: "Popcorn", id: "SN003", category: "Snacks", price: 12.00 },
  { name: "Biscuits", id: "SN004", category: "Snacks", price: 8.00 },
  
  // Fruits & Vegetables
  { name: "Apple", id: "FV001", category: "Fruits & Vegetables", price: 20.00 },
  { name: "Banana", id: "FV002", category: "Fruits & Vegetables", price: 10.00 },
  { name: "Orange", id: "FV003", category: "Fruits & Vegetables", price: 15.00 },
  { name: "Tomato", id: "FV004", category: "Fruits & Vegetables", price: 8.00 },
  { name: "Potato", id: "FV005", category: "Fruits & Vegetables", price: 6.00 },
  { name: "Onion", id: "FV006", category: "Fruits & Vegetables", price: 7.00 },
  { name: "Spinach", id: "FV007", category: "Fruits & Vegetables", price: 5.00 },
  { name: "Carrot", id: "FV008", category: "Fruits & Vegetables", price: 6.00 },
  
  // Grains & Staples
  { name: "Rice", id: "GS001", category: "Grains & Staples", price: 40.00 },
  { name: "Cooking Oil", id: "GS002", category: "Grains & Staples", price: 35.00 },
  { name: "Salt", id: "GS003", category: "Grains & Staples", price: 4.00 },
  { name: "Sugar", id: "GS004", category: "Grains & Staples", price: 12.00 },
  { name: "Spices", id: "GS005", category: "Grains & Staples", price: 15.00 },
  
  // Baby Care
  { name: "Diapers", id: "BC001", category: "Baby Care", price: 80.00 },
  { name: "Baby Wipes", id: "BC002", category: "Baby Care", price: 15.00 },
  { name: "Baby Food", id: "BC003", category: "Baby Care", price: 30.00 },
  
  // Stationery
  { name: "Notebook", id: "ST001", category: "Stationery", price: 12.00 },
  { name: "Pen", id: "ST002", category: "Stationery", price: 8.00 },
  { name: "Pencil", id: "ST003", category: "Stationery", price: 4.00 },
  { name: "Marker", id: "ST004", category: "Stationery", price: 10.00 }
];

// Helper to get random item
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findProduct(name) {
  const prod = products.find(p => p.name === name);
  if (!prod) console.error("Product not found: " + name);
  return prod;
}

// Generate dates in 2024
function getRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Generate random time
function getRandomTime() {
  const hh = Math.floor(Math.random() * 15) + 8; // 08:00 to 22:00
  const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const ss = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return { time: `${String(hh).padStart(2, '0')}:${mm}:${ss}`, hour: hh };
}

// Generate transactions
const numTransactions = 4000;
const transactionRows = [];

// Header
transactionRows.push("order_id;user_id;order_date;time;order_hour_of_day;product_name;quantity;price;category;product_id");

let orderId = 1000;

for (let i = 0; i < numTransactions; i++) {
  const userId = Math.floor(Math.random() * 500) + 1;
  const orderDate = getRandomDate();
  const { time, hour } = getRandomTime();
  
  let items = [];
  const rand = Math.random();
  
  if (rand < 0.15) {
    // Mandi & Personal Care (Soap, Shampoo, Toothpaste, Toothbrush)
    items.push(findProduct("Soap"));
    items.push(findProduct("Shampoo"));
    if (Math.random() < 0.90) items.push(findProduct("Toothpaste"));
    if (Math.random() < 0.80) items.push(findProduct("Toothbrush"));
    if (Math.random() < 0.40) items.push(findProduct("Face Wash"));
    if (Math.random() < 0.35) items.push(findProduct("Body Lotion"));
  } 
  else if (rand < 0.30) {
    // Sarapan (Bread, Milk, Butter, Cheese, Eggs)
    items.push(findProduct("Bread"));
    items.push(findProduct("Milk"));
    if (Math.random() < 0.90) items.push(findProduct("Butter"));
    if (Math.random() < 0.70) items.push(findProduct("Cheese"));
    if (Math.random() < 0.60) items.push(findProduct("Eggs"));
    if (Math.random() < 0.40) items.push(findProduct("Yogurt"));
  } 
  else if (rand < 0.45) {
    // Kebersihan Rumah (Detergent, Floor Cleaner, Dishwashing Liquid)
    items.push(findProduct("Detergent"));
    items.push(findProduct("Floor Cleaner"));
    if (Math.random() < 0.85) items.push(findProduct("Dishwashing Liquid"));
    if (Math.random() < 0.60) items.push(findProduct("Tissue"));
    if (Math.random() < 0.50) items.push(findProduct("Toilet Paper"));
  } 
  else if (rand < 0.60) {
    // Cemilan & Minuman (Chips, Soda, Popcorn, Chocolate)
    items.push(findProduct("Chips"));
    items.push(findProduct("Soda"));
    if (Math.random() < 0.85) items.push(findProduct("Popcorn"));
    if (Math.random() < 0.60) items.push(findProduct("Chocolate"));
    if (Math.random() < 0.40) items.push(findProduct("Biscuits"));
  } 
  else if (rand < 0.75) {
    // Pecinta Kopi & Teh (Coffee/Tea, Sugar, Cookies/Biscuits)
    const drink = Math.random() < 0.6 ? findProduct("Coffee") : findProduct("Tea");
    items.push(drink);
    items.push(findProduct("Sugar"));
    if (Math.random() < 0.85) items.push(findProduct("Cookies"));
    if (Math.random() < 0.60) items.push(findProduct("Biscuits"));
    if (Math.random() < 0.45) items.push(findProduct("Pastry"));
    if (Math.random() < 0.30) items.push(findProduct("Cake"));
  } 
  else if (rand < 0.90) {
    // Masak Dapur Utama (Rice, Cooking Oil, Spices, Tomato, Potato, Onion)
    items.push(findProduct("Rice"));
    items.push(findProduct("Cooking Oil"));
    if (Math.random() < 0.85) items.push(findProduct("Spices"));
    if (Math.random() < 0.70) items.push(findProduct("Onion"));
    if (Math.random() < 0.60) items.push(findProduct("Potato"));
    if (Math.random() < 0.50) items.push(findProduct("Tomato"));
    if (Math.random() < 0.40) items.push(findProduct("Spinach"));
  } 
  else {
    // Perlengkapan Bayi (Diapers, Baby Wipes, Baby Food)
    items.push(findProduct("Diapers"));
    items.push(findProduct("Baby Wipes"));
    if (Math.random() < 0.80) items.push(findProduct("Baby Food"));
  }
  
  // Noise: Tambah 1 barang acak dari kategori manapun untuk realisme belanjaan
  if (Math.random() < 0.4) {
    const randomProd = getRandom(products);
    if (!items.some(it => it.name === randomProd.name)) {
      items.push(randomProd);
    }
  }

  // Bersihkan dari null/undefined dan pastikan unik
  items = Array.from(new Set(items.filter(Boolean)));

  // Tulis ke CSV
  items.forEach(prod => {
    const qty = Math.floor(Math.random() * 3) + 1;
    const line = `${orderId};${userId};${orderDate};${time};${hour};${prod.name};${qty};${prod.price.toFixed(2)};${prod.category};${prod.id}`;
    transactionRows.push(line);
  });

  orderId++;
}

// Write to file
fs.writeFileSync(CSV_PATH, transactionRows.join("\n"), "utf-8");
console.log(`Successfully generated ${numTransactions} transactions with ${transactionRows.length - 1} rows to ${CSV_PATH}`);
