
//component
import StudnetCoursesTable from '../components/StudnetCoursesTable';
// ====================================================================
export default function MyCoursesPage() {

    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">My Courses</h1>
            <StudnetCoursesTable />
        </div>
    );
}