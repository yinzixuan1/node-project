import model from "./model.js";
import * as questionsDao from "../Questions/dao.js";

export async function createAttempt(attempt) {
    // return model.create(attempt);
    const existingAttempt = await model.findOne({ user: attempt.user, quiz: attempt.quiz });

    if (existingAttempt) {
        // 更新已有的 Attempt
        existingAttempt.answers = attempt.answers;
        existingAttempt.score = attempt.score;
        existingAttempt.attemptCount = existingAttempt.attemptCount + 1;
        await existingAttempt.save();
        return existingAttempt;
    }

    const newAttempt = await model.create(attempt);
    return newAttempt;
}

export function removeAttempt(attemptId) {
    return model.deleteOne(attemptId);
}

export async function calculateScore(attemptId) {
    try {
        // 获取 Attempt 数据
        const attempt = await model.findById(attemptId);
        if (!attempt) throw new Error("Attempt not found");

        // 获取 Quiz 的所有问题
        const questions = await questionsDao.findQuestionsForQuiz(attempt.quiz);

        // 构建正确答案的 Map（questionId -> { type, correctAnswer, possibleAnswers, points }）
        const questionDetails = new Map();
        questions.forEach(q => {
            questionDetails.set(q._id.toString(), {
                type: q.type,
                correctAnswer: q.correct_answer,
                possibleAnswers: q.possible_answers, // 填空题的答案数组
                points: q.points,
            });
        });

        // 初始化总分
        let totalScore = 0;

        // 遍历用户提交的答案
        const userAnswers = attempt.answers[0]; // 获取第一个对象
        for (const [questionId, userAnswer] of Object.entries(userAnswers)) {
            const question = questionDetails.get(questionId);
            if (!question) continue; // 如果题目不存在，跳过

            const { type, correctAnswer, possibleAnswers, points } = question;

            let isCorrect = false;

            // 根据题目类型判断是否正确
            if (type === "multiple selection") {
                isCorrect = userAnswer === correctAnswer;
            } else if (type === "fill in the blank") {
                isCorrect = possibleAnswers.some(
                    answer => answer.toLowerCase() === userAnswer.toLowerCase()
                );
            } else if (type === "true or false") {
                isCorrect = userAnswer === correctAnswer;
            }

            // 如果正确，加上题目分数
            if (isCorrect) {
                totalScore += points;
            }
        }

        // 更新分数到数据库
        attempt.score = totalScore;
        await attempt.save();
        return attempt;
    } catch (error) {
        console.error("Error calculating score:", error.message);
        throw error;
    }
}

export async function getLastAttemptForQuiz(userId, quizId) {
    try {
        const lastAttempt = await model.findOne({ user: userId, quiz: quizId });
        return lastAttempt;
    } catch (error) {
        console.error("Error fetching last attempt:", error.message);
        throw error;
    }
}