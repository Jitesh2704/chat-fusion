const db = require("../models");
const Counter = db.counter;

async function fetchAndUpdateSpecificCounter(identifier, counterField) {
  const filter = { identifier: identifier };
  const update = { $inc: { [counterField]: 1 } };
  const options = { new: true };
  console.log(identifier);
  console.log(counterField);
  try {
    const updatedCounter = await Counter.findOneAndUpdate(
      filter,
      update,
      options
    );
    console.log(updatedCounter);
    return updatedCounter[counterField];
  } catch (error) {
    console.error(`Error updating ${counterField} in counter:`, error);
    throw error;
  }
}

async function ensureCounterExists(identifier) {
  try {
    let counter = await Counter.findOne({ identifier: identifier });

    if (!counter) {
      counter = new Counter({ identifier: identifier });
      await counter.save();
    }

    return;
  } catch (error) {
    console.error("Error ensuring counter exists:", error);
    throw error; // or handle it as per your application's error handling strategy
  }
}

module.exports = {
  fetchAndUpdateSpecificCounter,
  ensureCounterExists,
};
