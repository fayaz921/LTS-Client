// src/features/cases/hooks/useCases.ts

import { useQuery } from "@tanstack/react-query";
import { getCases } from "../api/case-api";
import type { ApiResponse, PaginatedResponse } from "../../../shared/types/api.types";
import type { GetCaseDto } from "../types/case.types";

// ── Static Data ──────────────────────────────────────────────────
const STATIC_CASES: GetCaseDto[] = [
    { id: '1', caseNo: 'LTS-2026-0001', title: 'Muhammad Ali Khan vs Province of KPK', subject: 'Constitutional', dag: 'Adv. Saleem', status: 'Pending', dateInstitution: '2026-01-15', courtName: 'Peshawar High Court', departmentName: 'Constitutional', petitioners: ['Muhammad Ali Khan'] },
    { id: '2', caseNo: 'LTS-2026-0002', title: 'Fatima Bibi vs Land Revenue Dept', subject: 'Civil', dag: 'Adv. Tariq', status: 'Finalized', dateInstitution: '2026-01-20', courtName: 'District Court', departmentName: 'Civil', petitioners: ['Fatima Bibi'] },
    { id: '3', caseNo: 'LTS-2026-0003', title: 'Ahmed Enterprises vs FBR', subject: 'Corporate', dag: 'Adv. Hassan', status: 'Pending', dateInstitution: '2026-02-01', courtName: 'Peshawar High Court', departmentName: 'Corporate', petitioners: ['Ahmed Khan'] },
    { id: '4', caseNo: 'LTS-2026-0004', title: 'Noor-ul-Haq vs State', subject: 'Criminal', dag: 'Adv. Babar', status: 'Finalized', dateInstitution: '2026-02-10', courtName: 'Anti-Terrorism Court', departmentName: 'Criminal', petitioners: ['Noor-ul-Haq'] },
    { id: '5', caseNo: 'LTS-2026-0005', title: 'Zainab Sultana vs Khalid Mehmood', subject: 'Family', dag: 'Adv. Usman', status: 'Pending', dateInstitution: '2026-02-15', courtName: 'Family Court Peshawar', departmentName: 'Family', petitioners: ['Zainab Sultana'] },
    { id: '6', caseNo: 'LTS-2026-0006', title: 'Imran Shah vs WAPDA', subject: 'Civil', dag: 'Adv. Saleem', status: 'Pending', dateInstitution: '2026-02-20', courtName: 'District Court', departmentName: 'Civil', petitioners: ['Imran Shah'] },
    { id: '7', caseNo: 'LTS-2026-0007', title: 'Sana Mirza vs Karachi University', subject: 'Administrative', dag: 'Adv. Tariq', status: 'Finalized', dateInstitution: '2026-03-01', courtName: 'High Court Karachi', departmentName: 'Administrative', petitioners: ['Sana Mirza'] },
    { id: '8', caseNo: 'LTS-2026-0008', title: 'Bilal Chaudhry vs Tax Authority', subject: 'Tax', dag: 'Adv. Hassan', status: 'Pending', dateInstitution: '2026-03-05', courtName: 'Tax Tribunal', departmentName: 'Tax', petitioners: ['Bilal Chaudhry'] },
    { id: '9', caseNo: 'LTS-2026-0009', title: 'Hira Baig vs Housing Society', subject: 'Property', dag: 'Adv. Kamran', status: 'Finalized', dateInstitution: '2026-03-10', courtName: 'District Court', departmentName: 'Property', petitioners: ['Hira Baig'] },
    { id: '10', caseNo: 'LTS-2026-0010', title: 'Tariq Mehmood vs Punjab Govt', subject: 'Constitutional', dag: 'Adv. Babar', status: 'Pending', dateInstitution: '2026-03-15', courtName: 'Lahore High Court', departmentName: 'Constitutional', petitioners: ['Tariq Mehmood'] },
    { id: '11', caseNo: 'LTS-2026-0011', title: 'Sajida Parveen vs Ex-Husband', subject: 'Family', dag: 'Adv. Usman', status: 'Pending', dateInstitution: '2026-03-20', courtName: 'Family Court Lahore', departmentName: 'Family', petitioners: ['Sajida Parveen'] },
    { id: '12', caseNo: 'LTS-2026-0012', title: 'Ali Brothers vs PIA', subject: 'Corporate', dag: 'Adv. Saleem', status: 'Finalized', dateInstitution: '2026-03-25', courtName: 'High Court Islamabad', departmentName: 'Corporate', petitioners: ['Ali Khan', 'Umar Khan'] },
    { id: '13', caseNo: 'LTS-2026-0013', title: 'Rashida Bibi vs Neighbor', subject: 'Civil', dag: 'Adv. Tariq', status: 'Pending', dateInstitution: '2026-04-01', courtName: 'District Court', departmentName: 'Civil', petitioners: ['Rashida Bibi'] },
    { id: '14', caseNo: 'LTS-2026-0014', title: 'Faisal Qureshi vs SBP', subject: 'Banking', dag: 'Adv. Hassan', status: 'Finalized', dateInstitution: '2026-04-05', courtName: 'Banking Court', departmentName: 'Banking', petitioners: ['Faisal Qureshi'] },
    { id: '15', caseNo: 'LTS-2026-0015', title: 'Nasreen Akhtar vs School Board', subject: 'Administrative', dag: 'Adv. Kamran', status: 'Pending', dateInstitution: '2026-04-10', courtName: 'Administrative Tribunal', departmentName: 'Administrative', petitioners: ['Nasreen Akhtar'] },
    { id: '16', caseNo: 'LTS-2026-0016', title: 'Hamza Malik vs Landlord', subject: 'Property', dag: 'Adv. Babar', status: 'Finalized', dateInstitution: '2026-04-15', courtName: 'Rent Tribunal', departmentName: 'Property', petitioners: ['Hamza Malik'] },
    { id: '17', caseNo: 'LTS-2026-0017', title: 'Sobia Nawaz vs Hospital', subject: 'Medical', dag: 'Adv. Usman', status: 'Pending', dateInstitution: '2026-04-20', courtName: 'District Court', departmentName: 'Medical', petitioners: ['Sobia Nawaz'] },
    { id: '18', caseNo: 'LTS-2026-0018', title: 'Asif Zardari vs Election Commission', subject: 'Constitutional', dag: 'Adv. Saleem', status: 'Pending', dateInstitution: '2026-04-25', courtName: 'Supreme Court', departmentName: 'Constitutional', petitioners: ['Asif Zardari'] },
    { id: '19', caseNo: 'LTS-2026-0019', title: 'Rukhsana vs NADRA', subject: 'Administrative', dag: 'Adv. Tariq', status: 'Finalized', dateInstitution: '2026-05-01', courtName: 'Administrative Tribunal', departmentName: 'Administrative', petitioners: ['Rukhsana Begum'] },
    { id: '20', caseNo: 'LTS-2026-0020', title: 'Kamran Industries vs FBR', subject: 'Tax', dag: 'Adv. Hassan', status: 'Pending', dateInstitution: '2026-05-05', courtName: 'Tax Tribunal', departmentName: 'Tax', petitioners: ['Kamran Ahmed'] },
    { id: '21', caseNo: 'LTS-2026-0021', title: 'Shaheen Airlines vs CAA', subject: 'Corporate', dag: 'Adv. Kamran', status: 'Finalized', dateInstitution: '2026-05-10', courtName: 'High Court Islamabad', departmentName: 'Corporate', petitioners: ['Shaheen Group'] },
    { id: '22', caseNo: 'LTS-2026-0022', title: 'Pervez Akhtar vs Police', subject: 'Criminal', dag: 'Adv. Babar', status: 'Pending', dateInstitution: '2026-05-15', courtName: 'Sessions Court', departmentName: 'Criminal', petitioners: ['Pervez Akhtar'] },
    { id: '23', caseNo: 'LTS-2026-0023', title: 'Amina Siddiqui vs Builder', subject: 'Property', dag: 'Adv. Usman', status: 'Finalized', dateInstitution: '2026-05-20', courtName: 'District Court', departmentName: 'Property', petitioners: ['Amina Siddiqui'] },
    { id: '24', caseNo: 'LTS-2026-0024', title: 'Usman Ghani vs University', subject: 'Administrative', dag: 'Adv. Saleem', status: 'Pending', dateInstitution: '2026-05-25', courtName: 'High Court Peshawar', departmentName: 'Administrative', petitioners: ['Usman Ghani'] },
    { id: '25', caseNo: 'LTS-2026-0025', title: 'Nadia Hassan vs Insurance Co', subject: 'Civil', dag: 'Adv. Tariq', status: 'Finalized', dateInstitution: '2026-06-01', courtName: 'District Court', departmentName: 'Civil', petitioners: ['Nadia Hassan'] },
];

// ── Pagination Logic Frontend Pe ─────────────────────────────────
const getStaticPage = (page: number, pageSize: number): ApiResponse<PaginatedResponse<GetCaseDto>> => {
    const totalCount = STATIC_CASES.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const items = STATIC_CASES.slice(start, start + pageSize);

    return {
        isSuccess: true,
        message: 'Success',
        status: 200,
        data: { items, totalCount, page, pageSize, totalPages }
    };
};

// ── Hook ─────────────────────────────────────────────────────────
export const useCases = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: ['cases', page, pageSize],
        queryFn: () => getStaticPage(page, pageSize), // ← real API
        // placeholderData: getStaticPage(page, pageSize), // ← static data jab tak API na aaye
    });
};