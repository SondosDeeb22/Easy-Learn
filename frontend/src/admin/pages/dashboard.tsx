//component
import WelcomeCard from "../components/WelcomeCard";
import SemesterInfoCard from "../components/SemesterInfoCard";
import StudentsInfoCard from "../components/StudentsCard";
import CoursesInfoCard from "../components/CoursesCard";
import OfferedCoursesInfoCard from "../components/OfferedCoursesCard";

// hook
import { useUserData } from "../hooks/useUserData";

//redux
import { useAppSelector } from "../../redux/hooks";

// ======================================================================
export default function AdminDashboard() {
  const user = useAppSelector((state) => state.auth);
  const { data: userData, loading, error } = useUserData(user?.userId);

  // ======================================================================
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#F2F1ED] p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {userData && <WelcomeCard user={userData} />}
        <SemesterInfoCard />

        <div className="flex gap-6">
          <div className="w-1/2"><StudentsInfoCard /></div>
          <div className="w-1/2"><CoursesInfoCard /></div>
          <div className="w-1/2"><OfferedCoursesInfoCard /></div>
        </div>
      </div>
    </div >
  );
}