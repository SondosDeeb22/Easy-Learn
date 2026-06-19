import { Alert } from "antd";

import StudentCurrentCoursesTable from "../components/StudentCurrentCoursesTable";

import { useAppSelector } from "../../redux/hooks";
//hooks
import { useStudentCurrentCourses } from '../hooks/StudnetCurrentCoursesHook';
import { useUserData } from "../hooks/userDataHook";

// componente 
import WelcomeCard from "../components/WelcomeCard";
// ====================================================================
export default function StudentHomepage() {
    const user = useAppSelector((state) => state.auth);

    const { data } = useStudentCurrentCourses();
    // ------------------------------------------------------

    const { data: userData, loading, error } = useUserData(user?.userId);

    // show loading
    if (loading) return <div>Loading...</div>

    // show error
    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '50px 20PX', fontSize: '14px' }}
        />
    );
    // ------------------------------------------------------

    const semesterTitle = data?.[0]?.semesterTitle ?? "";
    return (
        <div className="p-6">
            {userData && <WelcomeCard user={userData} />}
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">My Courses - {semesterTitle}</h1>
            <StudentCurrentCoursesTable />
        </div>
    );
}