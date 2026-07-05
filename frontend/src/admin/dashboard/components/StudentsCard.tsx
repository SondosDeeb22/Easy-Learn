import React from 'react';
import { TeamOutlined, CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useStudents } from '../../students/hooks/useStudents';

// ==============================================================================
const StudentsInfoCard: React.FC = () => {
    const { data: studentsData, isLoading: isLoadingStudents } = useStudents({ page: 1, limit: 1 });

    if (isLoadingStudents) {
        return (
            <div className="m-2 p-5 bg-white/80 backdrop-blur-sm border border-navbar/30 rounded-xl flex justify-between items-center shadow-sm animate-pulse">
                <div className="flex items-center gap-3 w-1/3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-1/3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-1/3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    // ==============================================================================
    return (

        <div className=" rounded-xl bg-white border border-navbar/40 flex flex-col  justify-between shadow-sm transition-all duration-300 ">

            <div className="w-full h-10 bg-beige rounded-t-xl flex items-center justify-center">
                <h1 className="m-0 font-bold text-white">Students </h1>

            </div>
            <div className="m-3 flex-col space-y-3">
                {/* Active Students count */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-[#10B981]/10 p-3 rounded-xl text-[#10B981] flex items-center justify-center shadow-inner">
                        <TeamOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#10B981]">
                            Active Students
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 leading-none">
                            {studentsData?.activeCount ?? 0}
                        </h3>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200"></div>

                {/* Passive Students count */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-amber-600/10 p-3 rounded-xl text-amber-600 flex items-center justify-center shadow-inner">
                        <MinusCircleOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
                            Passive Students
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 leading-none">
                            {studentsData?.passiveCount ?? 0}
                        </h3>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200"></div>

                {/* Graduated Students count */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-burgundy/10 p-3 rounded-xl text-burgundy flex items-center justify-center shadow-inner">
                        <CheckCircleOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-burgundy">
                            Graduated Students
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 leading-none">
                            {studentsData?.graduatedCount ?? 0}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsInfoCard;
