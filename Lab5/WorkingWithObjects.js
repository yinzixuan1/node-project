const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
};

const module = {
    _id: "M101", name: "Introduction to Rocket Propulsion",
    description: "Basic principles of rocket propulsion and rocket engines.",
    course: "RS101",
}

export default function WorkingWithObjects(app) {
    app.get("/lab5/assignment", (req, res) => {
      res.json(assignment);
    });

    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });

    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    });

    app.get("/lab5/module", (req, res) => {
        res.json(module);
      });
  
      app.get("/lab5/module/name", (req, res) => {
          res.json(module.name);
      });

};