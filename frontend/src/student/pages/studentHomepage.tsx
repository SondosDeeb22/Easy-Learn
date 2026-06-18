import StudentCurrentCoursesTable from "../components/StudentCurrentCoursesTable";

//hooks
import { useStudentCurrentCourses } from '../hooks/StudnetCurrentCoursesHook';

// ====================================================================
export default function StudentHomepage() {

    const { data } = useStudentCurrentCourses();

    const semesterTitle = data?.[0]?.semesterTitle ?? "";
    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">{semesterTitle} Courses</h1>
            <StudentCurrentCoursesTable />
        </div>
    );
}