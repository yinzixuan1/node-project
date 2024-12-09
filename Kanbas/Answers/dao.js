// import AnswerModel from "./model.js";

// const createAnswer = async (userId, questionId, userAnswer) => {
//     const answer = {
//         user: userId,
//         question: questionId,
//         user_answer: userAnswer,
//     };
//     return AnswerModel.create(answer);
// };

import AnswerModel from "./model.js";

// 创建一条答案记录
export async function createAnswer(answer) {
    return AnswerModel.create(answer);
}

// 查询某个用户提交的所有答案
export async function findAnswersByUser(userId) {
    return AnswerModel.find({ user: userId });
}

// 查询某个问题的所有答案
export async function findAnswersByQuestion(questionId) {
    return AnswerModel.find({ question: questionId });
}

// 查询指定 attempt 的答案（如果答案记录有 `attempt` 字段，可扩展此方法）
export async function findAnswersByAttempt(attemptId) {
    return AnswerModel.find({ attempt: attemptId });
}