import model from "./model.js";

export function findAllCourses() {
  return model.find();
}

export function createCourse(course) {
  return model.create(course);
}

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
 } 

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, courseUpdates);
}

export function findAllPeopleInCourse(courseId) {
  const {enrollments, users} = Database;

  const enrolledUsers = users.filter((usr)=>enrollments.some((enrollment) => 
    enrollment.user === usr._id && enrollment.course === courseId));

  return enrolledUsers;
}