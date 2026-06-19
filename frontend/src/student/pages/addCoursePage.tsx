import { useState } from "react";

import { notification } from "antd";


//service
import { enrollStudent } from "../services/courses.service";
//hooks
import { useStudentCurrentCourses } from '../hooks/StudnetCurrentCoursesHook';
import { useOfferedCourses } from '../hooks/offeredCoursesHook';

//componenets
import OfferedCoursesTable from "../components/OfferedCoursesTable";
import EnrollButton from "../components/EnrollButton";

// interfaces
import { OfferedCourses } from "../interfaces/courses.interface";
// ====================================================================
export default function AddCoursePage() {
    const [selectedCourse, setSelectedCourse] = useState<OfferedCourses | null>(null);
    // Ant Design notification hook
    const [api, contextHolder] = notification.useNotification();

    // get current semester title 
    const { data } = useStudentCurrentCourses();
    const semesterTitle = data?.[0]?.semesterTitle ?? "";

    // update offerd courses
    const { data: offeredCourses, error, refetch } = useOfferedCourses();


    // ----------------------------------------------------

    const handleConfirm = async () => {
        if (!selectedCourse) return;
        try {
            await enrollStudent(selectedCourse.id);
            api.success({ title: "Enrolled successfully!", description: `You have been enrolled in  ${selectedCourse.code}` });
            setSelectedCourse(null);

            refetch();
        } catch (error) {
            // show error message
            console.error("Enrollment failed:", error);
            api.error({ title: "Failed to enroll", description: "Try again later" });
        }
    };



    // =====================================================================
    return (
        <div className="p-6">
            {/* page title ------------------------------- */}
            <div className="flex items-center justify-between mt-5 mb-10">
                <h1 className="text-2xl  font-bold text-gray-800">
                    {error ? "Available Courses" : `Available Courses - ${semesterTitle}`}
                    <p className="text-sm text-gray-500 mt-2 ">Select a Course to Insert</p>
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
            <OfferedCoursesTable data={offeredCourses} onSelect={setSelectedCourse} />
        </div>
    );
}