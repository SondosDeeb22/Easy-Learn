import { Alert } from "antd";
import { useEffect } from "react";
import { queryClient } from "../../lib/react-query/queryClient";

import { useAppSelector } from "../../redux/hooks";


//hooks
import { useCurrentStudentCourses } from '../courses/hooks/useCurrentStudentCourses';
import { useStudentData } from "./hooks/useStudentData";

import { useCurrentStudentGPA } from "./hooks/useCurrentStudentGPA";

// componente 
import WelcomeCard from "./components/WelcomeCard";
import CurrentStudentCoursesTable from "../courses/components/CurrentStudentCoursesTable";


// generic componenets
import Loading from '../../shared/components/Loading';
import ErrorState from "../../shared/components/ErrorState";

// ====================================================================
export default function StudentHomepage() {
    const user = useAppSelector((state) => state.auth);

    const { data: currentSemesterCourses, isLoading: currentSemesterCoursesLoading, error: currentSemesterCoursesError } = useCurrentStudentCourses();
    // ------------------------------------------------------

    // student basic data
    const { data: userData, isLoading: userDataLoading, error: userDataError } = useStudentData(user?.userId);

    // student gpa
    const { data: gpa, isLoading: gpaLoading, error: gpaError } = useCurrentStudentGPA(user?.userId, currentSemesterCourses?.semesterId);

    console.log(`gpa: ${gpa}`)
    // ------------------------------------------------------
    // update current semester courses if new course was added 
    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['currentStudentCourses'],
        });
    }, []);

    // show loading
    if (currentSemesterCoursesLoading || userDataLoading) return (
        <Loading />
    );



    // show error if any
    if (currentSemesterCoursesError || userDataError) return (
        <ErrorState message={currentSemesterCoursesError || userDataError} />
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
                    {gpaError && <Alert title={String(gpaError)} type="error" showIcon style={{ fontSize: '14px' }} />}
                </div>

            }


            <CurrentStudentCoursesTable
                currentCourses={currentSemesterCourses?.courses ?? []}
                loading={currentSemesterCoursesLoading}
                error={currentSemesterCoursesError && !currentSemesterCourses ? "Failed to Load Courses" : undefined}
            />
        </div>
    );
}