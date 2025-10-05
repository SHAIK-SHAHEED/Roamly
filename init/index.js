const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    // Attach a fixed owner to each listing
    const dataWithOwner = initData.data.map(obj => ({
      ...obj,
      owner: "68c69f3953c66afb4d02d69f",
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("🌱 New listings inserted successfully!");
  } catch (err) {
    console.error("❌ Error while inserting data:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔒 Connection closed");
  }
};

// Run
main().then(initDB);
