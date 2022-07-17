const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String },
  username: { type: String },
  step: { type: Number },
  lastMessageId: { type: Number } || { type: Array },
  lastChatId: { type: Number },
  currentRoute: { type: Object },
  savedRoute: { type: Object },
  isFollowing: { type: Boolean },
  followTrain: { type: Object },
  chatId: { type: Number },
  messages: { type: Array },
  createdAt: { type: Number }
});

module.exports = model("User", schema);
