// Academy dashboard mock data
export const courses = [
  { id: "CRS-001", title: "House Kit Assembly Fundamentals", category: "Assembly", duration: "2 weeks", modules: 8, enrolled: 124, status: "active" },
  { id: "CRS-002", title: "Safety & Site Management", category: "Safety", duration: "1 week", modules: 5, enrolled: 98, status: "active" },
  { id: "CRS-003", title: "Platform Usage for Franchisees", category: "Digital", duration: "3 days", modules: 4, enrolled: 210, status: "active" },
  { id: "CRS-004", title: "Advanced Roof Systems", category: "Assembly", duration: "1 week", modules: 6, enrolled: 45, status: "active" },
  { id: "CRS-005", title: "Quality Control & Inspection", category: "Quality", duration: "1 week", modules: 5, enrolled: 67, status: "draft" },
  { id: "CRS-006", title: "MEP Installation Basics", category: "MEP", duration: "2 weeks", modules: 10, enrolled: 0, status: "draft" },
];

export const trainees = [
  { id: "TRN-001", name: "Jean-Paul Habimana", region: "RW", enrolledCourses: 3, completedCourses: 2, progress: 78, status: "active" },
  { id: "TRN-002", name: "Amina Ochieng", region: "KE", enrolledCourses: 2, completedCourses: 2, progress: 100, status: "certified" },
  { id: "TRN-003", name: "Emmanuel Kiiza", region: "UG", enrolledCourses: 4, completedCourses: 1, progress: 35, status: "active" },
  { id: "TRN-004", name: "Fatima Mwangi", region: "KE", enrolledCourses: 2, completedCourses: 0, progress: 12, status: "active" },
  { id: "TRN-005", name: "David Nkurunziza", region: "RW", enrolledCourses: 3, completedCourses: 3, progress: 100, status: "certified" },
  { id: "TRN-006", name: "Grace Tembo", region: "TZ", enrolledCourses: 1, completedCourses: 0, progress: 45, status: "active" },
];

export const certifications = [
  { id: "CERT-001", traineeName: "Amina Ochieng", region: "KE", level: "Level 2 — Assembly Lead", issuedAt: "2026-02-15", expiresAt: "2027-02-15", status: "valid" },
  { id: "CERT-002", traineeName: "David Nkurunziza", region: "RW", level: "Level 3 — Site Supervisor", issuedAt: "2026-01-20", expiresAt: "2027-01-20", status: "valid" },
  { id: "CERT-003", traineeName: "Jean-Paul Habimana", region: "RW", level: "Level 1 — Assembler", issuedAt: "2025-11-10", expiresAt: "2026-05-10", status: "expiring" },
  { id: "CERT-004", traineeName: "Old Worker", region: "TZ", level: "Level 1 — Assembler", issuedAt: "2024-06-01", expiresAt: "2025-06-01", status: "expired" },
];

export const academyStats = {
  totalTrainees: 542,
  certifiedTeams: 185,
  activeCourses: 4,
  certificationRate: "78%",
};
