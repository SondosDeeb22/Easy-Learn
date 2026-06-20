import { useState } from "react";
import { Alert } from "antd";

import StudentCurrentCoursesTable from "../components/CurrentStudentCoursesTable";

import { useAppSelector } from "../../redux/hooks";

//hooks
import { useCurrentStudentCourses } from '../hooks/useCurrentStudentCourses';
import { useUserData } from "../hooks/userDataHook";

// componente 
import WelcomeCard from "../components/WelcomeCard";
import { queryClient } from "../../lib/react-query/queryClient";
// ====================================================================
export default function StudentHomepage() {
    const user = useAppSelector((state) => state.auth);

    const rowsLimit = 3;
    const [page, setPage] = useState(1); // page 1 as defualt


    const { data: currentSemesterCourses, isLoading, isError } = useCurrentStudentCourses(page, rowsLimit);
    // ------------------------------------------------------

    const { data: userData, loading, error: userDataError } = useUserData(user?.userId);

    // ------------------------------------------------------
    // update current semester courses if new course was added 
    queryClient.invalidateQueries({
        queryKey: ['currentStudentCourses']
    })

    // show loading
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );


    // hanlde error from user data hook
    if (userDataError) return (
        <Alert
            title={userDataError}
            type="error"
            showIcon
            style={{ margin: '50px 20PX', fontSize: '14px' }}
        />
    );

    // ------------------------------------------------------
    const semesterTitle = currentSemesterCourses?.semesterTitle ?? "";




    // ===========================================================================
    return (
        <div className="p-6">
            {userData && <WelcomeCard user={userData} />}
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">My Courses - {semesterTitle}</h1>
            <StudentCurrentCoursesTable
                currentCourses={currentSemesterCourses?.courses ?? []}
                loading={isLoading}
                error={isError && !currentSemesterCourses ? "Failed to Load Courses" : undefined}
                page={page}
                limit={rowsLimit}
                totalRows={currentSemesterCourses?.totalRows ?? 0}
                setPage={setPage}
            />
        </div>
    );
}