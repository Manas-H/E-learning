const { sql } = require("../../config/database");
const { sendEmail } = require("../../config/email");

const enrollUserInCourse = async (userId, courseId) => {
  try {
    // Check if the user is already enrolled in the course
    const existingEnrollment = await sql`
        SELECT * FROM user_courses WHERE user_id = ${userId} AND course_id = ${courseId}
      `;

    if (existingEnrollment.length > 0) {
      return {
        success: false,
        message: "User is already enrolled in this course",
      };
      //   throw new Error("User is already enrolled in this course");
    }

    // Insert the new enrollment record
    await sql`
        INSERT INTO user_courses (user_id, course_id) VALUES (${userId}, ${courseId})
      `;

    // Retrieve user and course details
    const [course] = await Promise.all([
      // sql`SELECT * FROM users WHERE id = ${userId}`,
      sql`SELECT * FROM courses WHERE id = ${courseId}`,
    ]);

    // Extract necessary details
    // const userEmail = user[0].email;
    const courseName = course[0].title;
    // console.log(courseName);

    // Send email notification
    await sendEmail(
      "Course Enrollment Confirmation",
      `Hello,\n\nYou have successfully enrolled in the course "${courseName}".\n\nThank you.`
    );

    return {
      success: true,
      message: "User enrolled in the course successfully",
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error enrolling user in course");
  }
};

const getEnrolledCourses = async (userId) => {
  try {
    const enrolledCourses = await sql`
          SELECT courses.* 
          FROM courses 
          INNER JOIN user_courses ON courses.id = user_courses.course_id
          WHERE user_courses.user_id = ${userId}
        `;
    return enrolledCourses;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching enrolled courses");
  }
};

module.exports = { enrollUserInCourse, getEnrolledCourses };
