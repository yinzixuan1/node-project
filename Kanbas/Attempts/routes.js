import * as attemptsDao from "./dao.js";
import model from "./model.js";
import QuizModel from "../Quizzes/model.js";

export default function AttemptRoutes(app) {
    // 校验用户是否可以尝试
    app.get("/api/quizzes/:quizId/attempt/check", async (req, res) => {
        try {
            const { quizId } = req.params;
            const currentUser = req.session.currentUser;

            if (!currentUser) {
                return res.status(401).json({ message: "User not logged in" });
            }

            // 获取测验信息
            const quiz = await QuizModel.findById(quizId);
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }

            const ATTEMPTS_LIMIT = quiz.has_many_attempts; // 是否有限制
            const MAX_ATTEMPTS = quiz.how_many_attempts; // 最大尝试次数

            // 获取用户的尝试记录
            const existingAttempt = await model.findOne({ user: currentUser._id, quiz: quizId });

            // 校验尝试次数
            if (existingAttempt) {
                if (ATTEMPTS_LIMIT === "yes" && existingAttempt.attemptCount >= MAX_ATTEMPTS) {
                    return res.status(403).json({ message: `Maximum attempt limit of ${MAX_ATTEMPTS} reached` });
                }
            }

            res.status(200).json({ canAttempt: true });
        } catch (error) {
            console.error("Error checking attempt limit:", error.message);
            res.status(500).json({ message: "Failed to check attempt limit" });
        }
    });
}
