const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function runAggregations() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // 1. 📊 Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" },
          count: { $sum: 1 }
        }
      },
      { $sort: { averagePrice: -1 } }
    ]).toArray();

    console.log('\n📚 Average Price by Genre:\n', avgPriceByGenre);

    // 2. 🧑‍💼 Author with the most books
    const mostBooksByAuthor = await books.aggregate([
      {
        $group: {
          _id: "$author",
          totalBooks: { $sum: 1 }
        }
      },
      { $sort: { totalBooks: -1 } },
      { $limit: 1 }
    ]).toArray();

    console.log('\n👑 Author with Most Books:\n', mostBooksByAuthor);

    // 3. 🗓️ Group books by publication decade and count them
    const booksByDecade = await books.aggregate([
      {
        $project: {
          decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
              "s"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$decade",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.log('\n📅 Books Grouped by Decade:\n', booksByDecade);

  } catch (err) {
    console.error('❌ Error in aggregation:', err);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

runAggregations();
