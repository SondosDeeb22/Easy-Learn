import React from 'react';
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons';

// hooks
import { useCurrentSemester } from '../../semesters/semesters.hook';
import { useAdminOfferedCourses } from '../../offeredCourses/hooks/offeredCourses.hook';
// ==============================================================================
const OfferedCoursesInfoCard: React.FC = () => {
    const { data: currentSemester, isLoading: currentSemesterLoading } = useCurrentSemester();
    console.log(`[ OfferedCoursesInfoCard ] [currentSemester]`, currentSemester)

    const { data: offeredCourses, isLoading } = useAdminOfferedCourses(currentSemester?.id, 1, 1000);
    console.log(`[ OfferedCoursesInfoCard ] [offeredCourses]`, offeredCourses)


    if (currentSemesterLoading) {
        return (
            <div className="w-full bg-white/80 backdrop-blur-sm border border-navbar/30 rounded-xl p-5 flex justify-between items-center shadow-sm animate-pulse">
                <div className="flex items-center gap-3 w-1/2">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-1/3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    // ==============================================================================

    {/* Courses Info Card ====================================================================== */ }
    return (

        <div className=" rounded-xl bg-white border border-navbar/40 flex flex-col  justify-between shadow-sm transition-all duration-300 ">

            <div className="w-full h-10 bg-beige rounded-t-xl flex items-center justify-center">
                <h1 className="m-0 font-bold text-white">Offered Courses</h1>

            </div>

            <div className='m-3 flex-col space-y-3'>
                {/* active courses -------------------------------------------------------*/}
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-burgundy/10 p-3 rounded-xl text-burgundy flex items-center justify-center shadow-inner">
                        <CheckCircleOutlined style={{ fontSize: '24px' }} />
                    </div>

                    <div className="space-y-1">
                        {/* <span className="text-[11px] font-bold uppercase tracking-widest text-burgundy/70">

                            Offered courses
                        </span> */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 leading-snug">
                                {offeredCourses?.totalRows} <span className="text-sm font-medium text-gray-400"> offered courses</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default OfferedCoursesInfoCard;
