import React, { useState, useEffect } from 'react';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useCurrentSemester } from '../hooks/offeredCourses.hook';
import dayjs from 'dayjs';

// ==============================================================================
const SemesterInfoCard: React.FC = () => {
    const { data: currentSemester, isLoading } = useCurrentSemester();
    const [today, setToday] = useState(dayjs());



    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return dayjs(dateStr).format('MMMM D, YYYY');
    };

    if (isLoading) {
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
    return (
        <div className="m-2 p-3 pl-5 rounded-xl bg-white border border-navbar /40 rounded - xl p - 5 flex flex - col md: flex - row md: items - center justify - between shadow - sm transition - all duration - 300 hover: shadow - md hover: border - burgundy / 30 gap - 6 ">
            {/* Left Section: Active Semester Details */}
            <div className="flex items-center gap-4 flex-1">
                <div className="bg-burgundy/10 p-3 rounded-xl text-burgundy flex items-center justify-center shadow-inner">
                    <CalendarOutlined style={{ fontSize: '24px' }} />
                </div>

                {/* current semester ------------------------------------------------------------------- */}
                <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-burgundy/70">
                        Active Academic Term
                    </span>

                    {currentSemester ? (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 leading-snug">
                                {currentSemester.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                {formatDate(currentSemester.startDate)} — {formatDate(currentSemester.endDate)}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-base font-semibold text-gray-400">
                                No Active Semester
                            </h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Divider  */}
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

            {/* today date ---------------------------------------------------------------------------*/}
            <div className="flex items-center gap-4 md:pl-6 min-w-[220px]">
                <div className="bg-navbar/30 p-3 rounded-xl text-burgundy flex items-center justify-center shadow-inner">
                    <ClockCircleOutlined style={{ fontSize: '24px' }} />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-base font-bold text-burgundy leading-tight">
                        {today.format('dddd')}
                    </h4>
                    <p className="text-xs font-semibold text-gray-600">
                        {today.format('MMMM D, YYYY')}
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SemesterInfoCard;
