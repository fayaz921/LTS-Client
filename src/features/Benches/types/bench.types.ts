// ============================================================
// BENCH TYPES FILE
// Yeh file TypeScript "interfaces" define karti hai.
// Interface matlab: ek template jo batata hai ke data ka
// shape kya hoga. Jaise ek form ka layout — kaunse fields
// honge aur unka type kya hoga (string, number, etc.)
// ============================================================

// BenchDto = Backend se jo data aata hai us ka shape
// "Dto" ka matlab hai "Data Transfer Object"
// Backend developer ne yeh same fields banai hain apni side pe
export interface BenchDto {
  id: string;              // Har bench entry ka unique ID (GUID format)
  caseId: string;          // Kis case se linked hai yeh judge
  judgeName: string;       // Judge ka naam
  judgeContactNo: string | null;  // Phone number — "| null" matlab optional hai, ho bhi sakta hai nahi bhi
  judgeEmail: string | null;      // Email — bhi optional hai
  createdAt: string;       // Kab add kiya gaya (date string format mein)
}

// CreateBenchDto = Jab hum naya judge add karte hain toh backend ko yeh data bhejna hota hai
// Notice karo: yahan "id" aur "createdAt" nahi hain
// Kyunki woh backend khud generate karta hai automatically
export interface CreateBenchDto {
  caseId: string;          // Kaun si case ke liye judge add kar rahe hain
  judgeName: string;       // Judge ka naam (required — "?" nahi hai)
  judgeContactNo?: string; // "?" matlab OPTIONAL hai — dena zaruri nahi
  judgeEmail?: string;     // Yeh bhi optional hai
}