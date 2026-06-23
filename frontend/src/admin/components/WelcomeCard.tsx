import { User } from '../interfaces/users.interface';

import { colors } from '../../styles/colorPalette';

interface WelcomeCardProps {
    user: User;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {

    const firstName = user.name.split(' ')[0];

    return (
        <>
            {/*  -------------------------------------*/}

            {/* Header ---------------------------------------*/}
            <div className="flex items-center gap-4 m-2 bg-burgundy/100 rounded-xl rounded-l-none p-3 pl-5 border-l-4 border-navbar/50">
                <div>
                    <p className="text-[12px] text-white uppercase tracking-widest m-0">Welcome back</p>
                    <p className="text-[25px] font-medium text-navbar m-0">{firstName}</p>
                    <p className="text-[14px] text-white m-0">{user.email}</p>
                    <p className="text-[13px] text-white m-0">ID: {user.id}</p>
                </div>
            </div>


        </>
    );
};

export default WelcomeCard;