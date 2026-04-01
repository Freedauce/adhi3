import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { trainees } from "../../mock/academyData";

export default function TraineeManagement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "TRAINEES"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Trainee Management</h2>
                <p className="text-sm text-gray-500 mt-1">Enroll trainees, assign courses, and track progress.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trainee</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Region</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Enrolled</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Completed</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainees.map(trainee => (
                            <tr key={trainee.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-bold text-gray-900">{trainee.name}</td>
                                <td className="px-6 py-4 text-gray-500">{trainee.region}</td>
                                <td className="px-6 py-4 text-center text-gray-700">{trainee.enrolledCourses}</td>
                                <td className="px-6 py-4 text-center text-gray-700">{trainee.completedCourses}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-adhi-primary rounded-full transition-all" style={{ width: `${trainee.progress}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 w-10 text-right">{trainee.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><Badge label={trainee.status === "certified" ? "Certified" : "In Training"} variant={trainee.status === "certified" ? "verified" : "active"} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
