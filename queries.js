const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function runQueries() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // 1. Find all books in a specific genre
    const fictionBooks = await books.find({ genre: "Fiction" }).toArray();
    console.log('\n📚 Fiction Books:\n', fictionBooks);

    // 2. Find books published after a certain year (e.g. after 2010)
    const recentBooks = await books.find({ published_year: { $gt: 2010 } }).toArray();
    console.log('\n📅 Books published after 2010:\n', recentBooks);

    // 3. Find books by a specific author (e.g. George Orwell)
    const orwellBooks = await books.find({ author: "George Orwell" }).toArray();
    console.log('\n✍️ Books by George Orwell:\n', orwellBooks);

    // 4. Update the price of a specific book (e.g. 1984)
    const updateResult = await books.updateOne(
      { title: "1984" },
      { $set: { price: 11.99 } }
    );
    console.log(`\n💰 Updated price for 1984: ${updateResult.modifiedCount} document(s)`);

    // 5. Delete a book by its title (e.g. The Hobbit)
    const deleteResult = await books.deleteOne({ title: "The Hobbit" });
    console.log(`\n🗑️ Deleted 'The Hobbit': ${deleteResult.deletedCount} document(s)`);

  } catch (err) {
    console.error('❌ Error running queries:', err);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

runQueries();
