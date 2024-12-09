import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        type: String,
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel" },
        description: String,
        points: Number,
        possible_answers: [String],
        correct_answer: String,
    },
    { collection: "questions" }
);

export default schema;