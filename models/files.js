const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
  },
  newName: {
    type: String,
  },
  path: {
    type: String,
  },
});

const FileModel = mongoose.model("files", fileSchema);
module.exports = FileModel;
