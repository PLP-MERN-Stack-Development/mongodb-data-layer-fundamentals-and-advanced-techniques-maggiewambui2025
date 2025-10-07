const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function runIndexing() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // 1. Create index on title
    const titleIndex = await books.createIndex({ title: 1 });
    console.log(`📌 Index created on title: ${titleIndex}`);

    // 2. Create compound index on author and published_year
    const compoundIndex = await books.createIndex({ author: 1, published_year: 1 });
    console.log(`📌 Compound index created: ${compoundIndex}`);

    // 3. Use explain() before and after indexing
    const explainBefore = await books.find({ title: "1984" }).explain("executionStats");
    console.log("\n🧠 Query Execution (Find by title):");
    console.log("Documents Examined:", explainBefore.executionStats.totalDocsExamined);
    console.log("Execution Time (ms):", explainBefore.executionStats.executionTimeMillis);

    const explainCompound = await books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");
    console.log("\n🧠 Query Execution (Find by author + published_year):");
    console.log("Documents Examined:", explainCompound.executionStats.totalDocsExamined);
    console.log("Execution Time (ms):", explainCompound.executionStats.executionTimeMillis);

  } catch (err) {
    console.error('❌ Error with indexing:', err);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

runIndexing();
