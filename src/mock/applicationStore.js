// Shared application store — used across Investor & Franchise applications
// This acts as a simple in-memory store (would be an API in production)

let _applicationId = 1000;

const nextId = () => `APP-${String(++_applicationId).padStart(4, "0")}`;

// ── Pre-seeded sample applications ──
const _applications = [
  {
    id: "APP-0901",
    type: "INVESTOR",
    status: "PENDING",
    submittedAt: "2026-03-28T14:20:00Z",
    opportunityId: "INV-OPP-001",
    opportunityTitle: "Kigali Phase 5 — 200 Units",
    region: "Rwanda",
    investmentAmount: 150000,
    applicant: {
      fullName: "James Ndayisaba",
      email: "james.ndayisaba@email.rw",
      phone: "+250 788 123 456",
      company: "Ndayisaba Capital Ltd",
      country: "Rwanda",
      nationalId: "1199880012345678",
    },
    applicationLetter: "I am writing to express my strong interest in investing in the Kigali Phase 5 housing development. As a Kigali-based investor with 8 years of experience in real estate development, I believe this project aligns with my portfolio strategy and commitment to affordable housing in Rwanda. I am prepared to invest $150,000 in this opportunity.",
    letterSignature: "James Ndayisaba",
    letterDate: "2026-03-28",
  },
  {
    id: "APP-0902",
    type: "FRANCHISE",
    status: "APPROVED",
    submittedAt: "2026-03-20T09:15:00Z",
    reviewedAt: "2026-03-22T16:30:00Z",
    reviewedBy: "Admin Sarah",
    reviewNote: "Strong application. Company has relevant construction experience.",
    applicant: {
      fullName: "Grace Otieno",
      email: "grace@mombasa-builds.co.ke",
      phone: "+254 722 987 654",
      company: "Mombasa Builds Co",
      country: "Kenya",
      businessRegNo: "BRN-KE-2024-88721",
    },
    franchiseRegion: "Kenya",
    targetUnitsPerYear: 50,
    applicationLetter: "We hereby apply for an ADHI franchise license to operate in the Mombasa region. Our company, Mombasa Builds Co, has been operating in the construction sector for 12 years. We have the infrastructure, workforce, and capital to deliver 50+ housing units annually.",
    letterSignature: "Grace Otieno — Managing Director",
    letterDate: "2026-03-20",
  },
  {
    id: "APP-0903",
    type: "INVESTOR",
    status: "REJECTED",
    submittedAt: "2026-03-15T11:00:00Z",
    reviewedAt: "2026-03-17T10:10:00Z",
    reviewedBy: "Admin Michael",
    reviewNote: "Investment amount below minimum threshold.",
    opportunityId: "INV-OPP-002",
    opportunityTitle: "Nairobi Expansion — 150 Units",
    region: "Kenya",
    investmentAmount: 5000,
    applicant: {
      fullName: "Peter Wanyama",
      email: "peter.w@mailbox.ke",
      phone: "+254 733 111 222",
      company: "",
      country: "Kenya",
      nationalId: "KE-ID-33201005",
    },
    applicationLetter: "I want to invest $5,000 in the Nairobi housing project.",
    letterSignature: "Peter Wanyama",
    letterDate: "2026-03-15",
  },
  {
    id: "APP-0904",
    type: "FRANCHISE",
    status: "PENDING",
    submittedAt: "2026-03-30T08:45:00Z",
    applicant: {
      fullName: "Emmanuel Mugabo",
      email: "emmanuel@kgl-housing.rw",
      phone: "+250 782 555 888",
      company: "Kigali Housing Solutions",
      country: "Rwanda",
      businessRegNo: "BRN-RW-2025-10293",
    },
    franchiseRegion: "Rwanda",
    targetUnitsPerYear: 80,
    applicationLetter: "Kigali Housing Solutions is seeking to partner with ADHI as a licensed franchisee in the Kigali region. We have secured land and construction permits, and our team of 45 trained builders is ready to begin assembly upon approval.",
    letterSignature: "Emmanuel Mugabo — CEO",
    letterDate: "2026-03-30",
  },
];

// ── Public API ──

export function getApplications() {
  return [..._applications];
}

export function getApplicationsByType(type) {
  return _applications.filter(a => a.type === type);
}

export function getApplicationById(id) {
  return _applications.find(a => a.id === id);
}

export function getPendingCount() {
  return _applications.filter(a => a.status === "PENDING").length;
}

export function addApplication(app) {
  const newApp = {
    ...app,
    id: nextId(),
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  };
  _applications.unshift(newApp);
  return newApp;
}

export function reviewApplication(id, status, reviewNote, reviewedBy = "Admin") {
  const idx = _applications.findIndex(a => a.id === id);
  if (idx === -1) return null;
  _applications[idx] = {
    ..._applications[idx],
    status,
    reviewNote,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
  };
  return _applications[idx];
}
