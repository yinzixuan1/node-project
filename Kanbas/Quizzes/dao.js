import model from "./model.js"

export function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
}

export function findPublishedQuizzes(courseId) {
    return model.find({ course: courseId, publish_status: "published" });
}

export function getQuiz(quizId) {
    return model.findOne({ _id: quizId });
}

export function createQuiz(quiz) {
    return model.create(quiz);
}

export function deleteQuiz(quizId) {
    return model.deleteOne({_id: quizId});
}

export function updateQuiz(quizId, quizUpdates) {
    return model.updateOne({_id: quizId}, quizUpdates);
}

export function setPublishStatus(quizId, status) {
    return model.updateOne({_id: quizId}, {publish_status: status});
}