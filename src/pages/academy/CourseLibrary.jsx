import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { courses, academyStats } from "../../mock/academyData";
import { BookOpen, Users, Award, Clock } from "lucide-react";

export default function CourseLibrary() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "COURSES"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Course Library</h2>
                <p className="text-sm text-gray-500 mt-1">All training modules for house kit assembly, safety, and platform usage.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: <Users size={18} />, label: "Total Trainees", value: String(academyStats.totalTrainees) },
                    { icon: <Award size={18} />, label: "Certified Teams", value: String(academyStats.certifiedTeams) },
                    { icon: <BookOpen size={18} />, label: "Active Courses", value: String(academyStats.activeCourses) },
                    { icon: <Clock size={18} />, label: "Cert. Rate", value: academyStats.certificationRate },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-adhi-surface text-adhi-primary rounded-xl flex items-center justify-center">{stat.icon}</div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-adhi-surface text-adhi-primary">{course.category}</span>
                            <Badge label={course.status === "active" ? "Active" : "Draft"} variant={course.status === "active" ? "active" : "pending"} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span>{course.modules} modules</span>
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-500">{course.enrolled} enrolled</span>
                            <button className="text-sm font-semibold text-adhi-primary hover:underline">Manage →</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
