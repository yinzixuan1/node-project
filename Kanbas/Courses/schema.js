import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: String,
        number: String,
        credits: Number,
        description: String,
        img: String,
    },
    { collection: "courses" }
);

export default schema;