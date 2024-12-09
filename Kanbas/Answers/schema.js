import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
      question: {type: mongoose.Schema.Types.ObjectId, ref: "QuestionModel"},
      user_answer: String,
   },
   { collection: "answers" }
);

export default schema;