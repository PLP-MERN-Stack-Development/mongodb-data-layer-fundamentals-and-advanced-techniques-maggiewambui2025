const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function runAdvancedQueries() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // 1. Find books in stock and published after 2010
    const inStockRecent = await books.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log('\n📘 In stock & published after 2010:\n', inStockRecent);

    // 2. Use projection to return only title, author, and price
    const projectedBooks = await books.find({}, {
      projection: { title: 1, author: 1, price: 1, _id: 0 }
    }).toArray();
    console.log('\n🧾 Projected Fields (title, author, price):\n', projectedBooks);

    // 3. Sort by price ascending
    const priceAsc = await books.find({}).sort({ price: 1 }).toArray();
    console.log('\n💲 Sorted by price (ascending):\n', priceAsc);

    // 4. Sort by price descending
    const priceDesc = await books.find({}).sort({ price: -1 }).toArray();
    console.log('\n💲 Sorted by price (descending):\n', priceDesc);

    // 5. Pagination: Limit to 5 books, skip first 5 (Page 2)
    const page2 = await books.find({})
      .sort({ title: 1 })
      .skip(5)
      .limit(5)
      .toArray();
    console.log('\n📄 Page 2 (5 books, sorted by title):\n', page2);

  } catch (err) {
    console.error('❌ Error running advanced queries:', err);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

runAdvancedQueries();
