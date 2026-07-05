import { useState } from "react";

import { notification } from "antd";


//service
import { enrollStudent } from "../courses.service";

//hooks
import { useCurrentStudentCourses } from '../hooks/useCurrentStudentCourses';
import { useOfferedCourses } from '../../offeredCourses/hooks/useOfferedCourses';

//componenets
import OfferedCoursesTable from "../../offeredCourses/components/OfferedCoursesTable";
import EnrollButton from "../../offeredCourses/components/EnrollButton";

// interfaces
import { CourseWithGrade } from "../courses.interface";

// react query
import { useQueryClient } from "@tanstack/react-query";

// ====================================================================
export default function AddCoursePage() {
    const [selectedCourse, setSelectedCourse] = useState<CourseWithGrade | null>(null);
    const [page, setPage] = useState(1); // initial state of page

    const PAGE_LIMIT = 8;

    // Ant Design notification hook
    const [api, contextHolder] = notification.useNotification();

    // get current semester title 
    const { data: currentSemester } = useCurrentStudentCourses();
    const semesterTitle = currentSemester?.semesterTitle ?? "";

    // update offerd course
    const {
        data: offeredCourses,
        isLoading,
        isError: offeredCoursesError,
    } = useOfferedCourses(page, PAGE_LIMIT);


    // ----------------------------------------------------
    const queryClient = useQueryClient();

    const handleConfirm = async () => {
        if (!selectedCourse) return;

        try {
            await enrollStudent(selectedCourse.id,);
            api.success({ title: "Enrolled successfully!", description: `You have been enrolled in ${selectedCourse.code}` });
            setSelectedCourse(null);

            // mark the cache stale and automatically refetch offeredCourses
            queryClient.invalidateQueries({
                queryKey: ['offeredCourses']
            });
            //return user to first page
            setPage(1);

        } catch (enrollmentError: any) {
            console.error("Enrollment failed:", enrollmentError);
            const errorMessage = enrollmentError.response?.data?.message || "Try again later";
            api.error({ title: "Failed to enroll", description: errorMessage });
            setSelectedCourse(null);

            // Refetch offered courses immediately to sync list if it changed
            queryClient.invalidateQueries({
                queryKey: ['offeredCourses']
            });
        }
    };



    // =====================================================================
    return (
        <div className="p-6">
            {contextHolder}
            {/* page title ------------------------------- */}
            <div className="flex items-center justify-between mt-5 mb-10">
                <h1 className="text-2xl  font-bold text-gray-800">
                    {offeredCoursesError ? "Available Courses" : `Available Courses - ${semesterTitle}`}
                    <p className="text-sm text-gray-500 mt-2 ">Select a Course to Add</p>
                </h1>
                <EnrollButton
                    selectedCourse={selectedCourse}
                    onConfirm={handleConfirm}
                />
            </div>

            {/* Warning banner ------------------- */}
            <>{offeredCourses?.remainingCredits === 0 &&
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                    <span className="text-amber-600 mt-0.5">⚠</span>
                    <p className="text-sm text-amber-800">
                        You have reached the maximum number of credits for this semester
                    </p>
                </div>
            }</>
            {/* table --------------------------------- */}
            <OfferedCoursesTable
                offeredCourses={offeredCourses?.courses ?? []}
                loading={isLoading}
                error={offeredCoursesError ? "Failed to load courses" : undefined}
                page={page}
                limit={8}
                totalRows={offeredCourses?.totalRows ?? 0}
                setPage={setPage}
                onSelect={setSelectedCourse}
                selectedCourseId={selectedCourse?.id ?? null}
            />
        </div>
    );
}