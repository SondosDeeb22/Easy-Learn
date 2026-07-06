import React from 'react';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

// ============================================================
interface ErrorStateProps {
    message?: string | Error | null;
}

// ============================================================
const ErrorState: React.FC<ErrorStateProps> = ({
    message,
}) => {

    const displayMessage =
        message instanceof Error
            ? message.message
            : message ?? "Something went wrong. Please try again later.";


    return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
            {/* Icon */}
            <div className="relative mb-5">
                <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center">
                    <ExclamationCircleOutlined className="text-burgundy text-2xl" />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-gray-700 mb-1">
                Something went wrong
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed mb-5">
                {displayMessage}
            </p>

        </div>
    );
};

export default ErrorState;
