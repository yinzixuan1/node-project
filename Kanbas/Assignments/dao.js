import model from "./model.js";

export function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createAssignment(assignment) {
    return model.create(assignment);
}

export function deleteAssignment(assignmentId) {
    return model.deleteOne({_id: assignmentId});
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({_id: assignmentId}, assignmentUpdates);
}