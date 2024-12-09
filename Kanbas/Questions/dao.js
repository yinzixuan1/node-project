import model from "./model.js"

export function findQuestionsForQuiz(quizId) {
    return model.find({ quiz: quizId });
}

export function getQuestion(questionId) {
    return model.findOne({ _id: questionId });
}

export function createQuestion(question) {
    return model.create(question);
}

export function deleteQuestion(questionId) {
    return model.deleteOne({_id: questionId});
}

export function updateQuestion(questionId, questionUpdates) {
    return model.updateOne({_id: questionId}, questionUpdates);
}