import model from "./model.js";

export function updateModule(moduleId, moduleUpdates) {
    return model.updateOne({ _id: moduleId }, moduleUpdates);
}  

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId });
}   

export function createModule(module) {
    return model.create(module);
}

export function findModulesForCourse(courseId) {
    return model.find({ course: courseId });
}