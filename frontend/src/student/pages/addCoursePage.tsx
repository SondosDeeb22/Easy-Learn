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

    // get current semester title 
    const { data } = useStudentCurrentCourses();
    const semesterTitle = data?.[0]?.semesterTitle ?? "";

    // update offerd courses
    const { data: offeredCourses, refetch } = useOfferedCourses();


    // ----------------------------------------------------

    const handleConfirm = async () => {
        if (!selectedCourse) return;
        try {
            await enrollStudent(selectedCourse.id);
            notification.success({ message: "Enrolled successfully!", description: `You have been enrolled in  ${selectedCourse.code}` });

            refetch();
        } catch (error) {
            // show error message
            console.error("Enrollment failed:", error);
            notification.error({ message: "Failed to enroll", description: "Try again later" });
        }
    };



    // =====================================================================
    return (
        <div className="p-6">
            {/* page title ------------------------------- */}
            <div className="flex items-center justify-between mt-5 mb-10">
                <h1 className="text-2xl  font-bold text-gray-800">
                    Available Courses - {semesterTitle}
                    <p className="text-sm text-gray-500 mt-2 ">Select a Course to Insert</p>
                </h1>
                <EnrollButton
                    selectedCourse={selectedCourse}
                    onConfirm={handleConfirm}
                />
            </div>

            {/* table --------------------------------- */}
            <OfferedCoursesTable data={offeredCourses} onSelect={setSelectedCourse} />
        </div>
    );
}