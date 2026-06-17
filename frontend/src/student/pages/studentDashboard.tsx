import CurrentSemesterCoursesTable from "../components/CurrentSemesterCoursesTable";

//hooks
import { useCurrentSemesterCourses } from '../hooks/currentSemesterCoursesHook';

// ====================================================================
export default function StudentDashboard() {

    const { data } = useCurrentSemesterCourses();

    const semesterTitle = data?.[0]?.semesterTitle ?? "";
    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">{semesterTitle} Courses</h1>
            <CurrentSemesterCoursesTable />
        </div>
    );
}