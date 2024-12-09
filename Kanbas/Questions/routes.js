import * as questionsDao from "./dao.js";

export default function QuestionRoutes(app) {

    app.get("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const question = await questionsDao.getQuestion(questionId);
        res.json(question);
    });

    app.delete("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const status = await questionsDao.deleteQuestion(questionId);
        res.send(status);
    });

    app.put("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const quizUpdates = req.body;
        const status = await questionsDao.updateQuestion(questionId, quizUpdates);
        res.send(status);
    });

}