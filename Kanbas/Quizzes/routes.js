import * as quizzesDao from "./dao.js";
import * as questionsDao from "../Questions/dao.js";
import * as attemptsDao from "../Attempts/dao.js";

export default function QuizRoutes(app) {

    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizzesDao.getQuiz(quizId);
        res.json(quiz);
    });

    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const status = await quizzesDao.deleteQuiz(quizId);
        res.send(status);
    });

    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quizUpdates = req.body;
        const status = await quizzesDao.updateQuiz(quizId, quizUpdates);
        res.send(status);
    });

    app.put("/api/quizzes/:quizId/status", async (req, res) => {
        const { quizId } = req.params;
        const { newStatus } = req.body;
        const status = await quizzesDao.setPublishStatus(quizId, newStatus);
        res.send(status);
    });

    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        res.json(questions);
    });

    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const question = {
            ...req.body,
            quiz: quizId,
        };
        const newQuestion = await questionsDao.createQuestion(question);
        res.send(newQuestion);
    })

    app.post("/api/quizzes/:quizId/submit", async (req, res) => {
        try {
            console.log("User Info:", req.session); // 打印用户信息
            const currentUser = req.session.currentUser;
            const { quizId } = req.params;
            const { answers } = req.body;
            const attempt = {
                quiz: quizId,
                user: currentUser._id,
                answers,
            };
            
            // const result = await attemptsDao.createAttempt(attempt);

            const createdAttempt = await attemptsDao.createAttempt(attempt);
            const scoredAttempt = await attemptsDao.calculateScore(createdAttempt._id);

            const questions = await questionsDao.findQuestionsForQuiz(quizId);
            const quiz = await quizzesDao.getQuiz(quizId);
            
            console.log("Questions fetched:", questions); // 查看题目内容
            const questionResults = questions.map((q) => {
                const userAnswer = answers[q._id.toString()] || null; // 用户的答案
                const correctAnswer = q.correct_answer
                const possibleAnswers = q.possible_answers; // 正确答案
                let isCorrect = false;
    
                if (q.type === "multiple selection" || q.type === "true or false") {
                    isCorrect = userAnswer === correctAnswer;
                } else if (q.type === "fill in the blank") {
                    // isCorrect = correctAnswer.includes(userAnswer?.toLowerCase());
                    isCorrect = possibleAnswers.some(
                        answer => answer.toLowerCase() === userAnswer.toLowerCase()
                    );
                }
    
                return {
                    questionId: q._id,
                    questionText: q.description,
                    correctAnswer,
                    possibleAnswers,
                    userAnswer,
                    isCorrect,
                };
            });


            // res.status(201).json(scoredAttempt);
            res.status(201).json({
                score: scoredAttempt.score,
                totalPoints: quiz.points,
                results: questionResults,
            });
        } catch (e) {
            console.error(e);
            res.status(500).send("Failed to submit the quiz.");
        }
    });

    app.get("/api/quizzes/:quizId/lastAttempt", async (req, res) => {
        try {
            const { quizId } = req.params;
            const currentUser = req.session.currentUser;
    
            // 获取最近一次的 Attempt
            const lastAttempt = await attemptsDao.getLastAttemptForQuiz(currentUser._id, quizId);
            if (!lastAttempt) {
                return res.status(404).json({ message: "No attempts found for this quiz." });
            }
    
            // 生成 result 页面数据
            const questions = await questionsDao.findQuestionsForQuiz(quizId);
            const quiz = await quizzesDao.getQuiz(quizId);
            const questionResults = questions.map((q) => {
                const userAnswer = lastAttempt.answers[0][q._id.toString()] || null;
                const correctAnswer = q.correct_answer;
                const possibleAnswers = q.possible_answers;
                let isCorrect = false;
    
                if (q.type === "multiple selection" || q.type === "true or false") {
                    isCorrect = userAnswer === correctAnswer;
                } else if (q.type === "fill in the blank") {
                    isCorrect = possibleAnswers.some(
                        (answer) => answer.toLowerCase() === userAnswer?.toLowerCase()
                    );
                }
    
                return {
                    questionId: q._id,
                    questionText: q.description,
                    correctAnswer,
                    possibleAnswers,
                    userAnswer,
                    isCorrect,
                };
            });
    
            // 返回最近一次的结果
            res.status(200).json({
                score: lastAttempt.score,
                totalPoints: quiz.points,
                results: questionResults,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch last attempt." });
        }
    });
    
}