import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: String,
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
        instruction: String,
        num_of_questions: Number,
        quiz_type: String,
        points: Number,
        assignment_group: String,
        shuffle_answer: String,
        has_time_limit: String,
        time_limit: Number,
        has_many_attempts: String,
        how_many_attempts: Number,
        show_correct_answer: String,
        show_answer_date: Date,
        access_code_required: String,
        access_code: String,
        one_question_at_a_time: String,
        webcam_required: String,
        lock_questions_after_answering: String,
        due_date: Date,
        available_date: Date,
        until_date: Date,
        publish_status: String,
    },
    { collection: "quizzes" }
);

export default schema;