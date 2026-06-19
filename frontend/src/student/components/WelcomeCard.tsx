import { StudentData } from '../interfaces/users.interface';

import { colors } from '../../styles/colorPalette';

interface WelcomeCardProps {
    user: StudentData;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {

    const firstName = user.name.split(' ')[0];
    const formattedBirthDate = new Date(user.birthDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className={`bg-[white] rounded-xl border border-gray-200 px-6 py-5 mb-10 mt-5`}>

            {/* Header ---------------------------------------*/}
            <div className="flex items-center gap-4 mb-5 bg-burgundy/100  rounded-2xl p-3 pl-5">

                <div>
                    <p className="text-[12px] text-white uppercase tracking-widest m-0">Welcome back</p>
                    <p className="text-[25px] font-medium text-navbar m-0">{firstName}</p>
                    <p className="text-[14px] text-white m-0">{user.email}</p>
                    <p className="text-[13px] text-white m-0">ID: {user.id}</p>
                </div>
            </div>

            {/* Stats -------------------------------------*/}
            <div className="border-t border-gray-200 pt-4 grid grid-cols-4 gap-3">

                <div className="bg-navbar/50 rounded-lg p-3">
                    <p className="text-[12px] text-black mb-1">Birth date</p>
                    <p className="text-[14px] font-medium text-black">{formattedBirthDate}</p>
                </div>

                <div className="bg-navbar/50 rounded-lg p-3">
                    <p className="text-[12px] text-black mb-1">Current Semester Credits</p>
                    <p className="text-[14px] font-medium text-black">{user.currentSemesterCredit}</p>
                </div>

                <div className="bg-navbar/50 rounded-lg p-3">
                    <p className="text-[12px] text-black mb-1">Credit Limit (Per Semester)</p>
                    <p className="text-[14px] font-medium text-black">{user.maxCredits}</p>
                </div>

                <div className="bg-navbar/50 rounded-lg p-3">
                    <p className="text-[12px] text-black mb-1">Cumulative Credits</p>
                    <p className="text-[14px] font-medium text-black">{user.totalCredit}</p>
                </div>


            </div>
        </div >
    );
};

export default WelcomeCard;