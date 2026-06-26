import { useState } from "react";
import { Alert } from "antd";

import CurrentStudentCoursesTable from "../components/CurrentStudentCoursesTable";

import { useAppSelector } from "../../redux/hooks";

//hooks
import { useCurrentStudentCourses } from '../hooks/useCurrentStudentCourses';
import { useStudentData } from "../hooks/useStudentData";

import { useCurrentStudentGPA } from "../hooks/useCurrentStudentGPA";

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

    // student basic data
    const { data: userData, loading, error: userDataError } = useStudentData(user?.userId);

    // student gpa
    const { data: gpa, loading: gpaLoading, error: gpaError } = useCurrentStudentGPA(user?.userId, currentSemesterCourses?.semesterId);

    console.log(`gpa: ${gpa}`)
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
    const year = semesterTitle.split(" ")[1];
    const season = semesterTitle.split(" ")[0];




    // ===========================================================================
    return (
        <div className="p-6">
            {userData && <WelcomeCard user={userData} semesterId={currentSemesterCourses?.semesterId ?? ""} />}
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">{gpa ? `My Courses` : `My Courses - ${semesterTitle}`}</h1>

            {/* show student gpa card only if his gpa for current semester was calcuated */}
            {gpa !== null &&

                <div className="mb-4 bg-navbar/50 rounded-md p-4">
                    <div className="flex items-center mb-2 ">
                        <h2 className="text-lg font-semibold pr-3"> {year} Academic Year - {season} Semester GPA:</h2>
                        <div className="flex items-center gap-2">
                            {gpaLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-burgundy"></div>}
                            {gpa !== null && <span className="text-xl font-bold text-burgundy pr-2 bg-burg">{gpa}</span>}
                        </div>
                    </div>
                    {gpaError && <Alert title={gpaError} type="error" showIcon style={{ fontSize: '14px' }} />}
                </div>

            }


            <CurrentStudentCoursesTable
                currentCourses={currentSemesterCourses?.courses ?? []}
                loading={isLoading}
                error={isError && !currentSemesterCourses ? "Failed to Load Courses" : undefined}
            />
        </div>
    );
}