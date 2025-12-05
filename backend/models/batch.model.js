const { Schema, model } = require("mongoose");

const batchSchema = new Schema({
  batchName: {
    type: String,
    required: true,
    unique: true,
  },
  strength: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      type: String,
      required: true,
    },
  ],
});

const Batch = model("Batch", batchSchema);

module.exports = Batch;
