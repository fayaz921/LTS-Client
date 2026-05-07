// ============================================================
// BenchPage COMPONENT
// Yeh woh actual page hai jo user browser mein dekhta hai.
// Yahan se saari cheezein ek jagah milti hain:
//   - hooks se data aata hai
//   - table mein show hota hai
//   - form se naya judge add hota hai
//   - delete button se judge hata hota hai
//
// JSX = JavaScript + HTML milake likhne ka tarika
// React mein HTML ko "JSX" kehte hain jo .tsx files mein hota hai
// ============================================================

// React aur useState import karo
// useState = component ka local data store — jab change ho toh page re-render hota hai
import { useState } from 'react';

// Apne banaye hooks import karo
import { useBench } from '../hooks/useBench';
import { useCreateBench } from '../hooks/useCreateBench';
import { useDeleteBench } from '../hooks/useDeleteBench';

// CreateBenchDto type import karo form ke liye
import type { CreateBenchDto } from '../types/bench.types';

// -------------------------------------------------------
// Component function — yeh ek function hai jo HTML return karta hai
// React mein har page/component ek function hota hai
// -------------------------------------------------------
const BenchPage = () => {

  // -------------------------------------------------------
  // STATE VARIABLES
  // useState() hook local data store karta hai component mein
  // Jab state change ho toh React automatically page update karta hai
  // -------------------------------------------------------

  // showForm: true/false — form dikhana hai ya chhupana
  // setShowForm: woh function jo showForm ki value change karta hai
  const [showForm, setShowForm] = useState(false);

  // searchCaseId: user ne search box mein jo Case ID likhi hai
  const [searchCaseId, setSearchCaseId] = useState('');

  // activeCaseId: jis case ke bench/judges dikhane hain
  const [activeCaseId, setActiveCaseId] = useState('');

  // formData: form ke saare fields ka data ek object mein
  // Shuru mein saare fields empty string hain
  const [formData, setFormData] = useState<CreateBenchDto>({
    caseId: '',
    judgeName: '',
    judgeContactNo: '',
    judgeEmail: '',
  });

  // -------------------------------------------------------
  // HOOKS — Data aur mutations
  // -------------------------------------------------------

  // useBench hook call karo activeCaseId ke saath
  // data = bench entries ki list
  // isLoading = true jab data aa raha ho
  // isError = true agar koi error aaya
  const { data: benchList, isLoading, isError } = useBench(activeCaseId);

  // Create mutation — naya judge add karne ke liye
  // isPending = true jab request chal rahi ho
  const { mutate: createBench, isPending: isCreating } = useCreateBench();

  // Delete mutation — judge hatane ke liye
  const { mutate: deleteBench, isPending: isDeleting } = useDeleteBench();

  // -------------------------------------------------------
  // HANDLER FUNCTIONS
  // Yeh functions user ke actions pe kaam karte hain
  // -------------------------------------------------------

  // Jab user search kare — activeCaseId set karo
  const handleSearch = () => {
    setActiveCaseId(searchCaseId.trim()); // .trim() = extra spaces hata do
  };

  // Jab koi input field change ho — formData update karo
  // "e" = event object — browser se milta hai, batata hai kya change hua
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name = field ka naam, value = naya value
    // "..." spread operator = purani values raho, sirf yeh ek field update karo
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Jab form submit ho — backend ko data bhejo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Browser ka default behavior rok do (page reload nahi hona chahiye)

    // createBench mutation call karo formData ke saath
    createBench(formData, {
      onSuccess: () => {
        // Kaamyabi ke baad form close karo aur data saaf karo
        setShowForm(false);
        setFormData({ caseId: '', judgeName: '', judgeContactNo: '', judgeEmail: '' });
        alert('Judge successfully add ho gaya!');
      },
      onError: () => {
        alert('Kuch galat ho gaya! Dobara koshish karo.');
      },
    });
  };

  // Jab delete button dabao
  const handleDelete = (id: string) => {
    // window.confirm = browser ka built-in confirmation popup
    const confirmed = window.confirm('Kya aap sach mein yeh judge delete karna chahte hain?');
    if (confirmed) {
      deleteBench(id);
    }
  };

  // -------------------------------------------------------
  // JSX RETURN — Yahan actual HTML-like code likhte hain
  // className = HTML ka "class" attribute (Bootstrap classes use hoti hain)
  // Bootstrap = ek CSS library jo ready-made design deti hai
  // -------------------------------------------------------
  return (
    // "container-fluid" = poori width le lo, Bootstrap class hai
    <div className="container-fluid py-4">

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* d-flex = flexbox, justify-content-between = dono sides pe rakho */}
        <div>
          <h2 className="mb-1" style={{ color: '#1a1a2e', fontWeight: 700 }}>
            ⚖️ Bench Management
          </h2>
          <p className="text-muted mb-0">Cases ke judges track karo</p>
        </div>

        {/* ADD JUDGE BUTTON */}
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          // showForm toggle karo — agar false tha toh true, agar true tha toh false
        >
          {showForm ? '✕ Cancel' : '+ Add Judge'}
        </button>
      </div>

      {/* SEARCH SECTION — Case ID se search karo */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="card-title mb-3">  Case ID se Judges Dekho</h6>
          <div className="d-flex gap-2">
            {/* gap-2 = items ke beech thoda space */}
            <input
              type="text"
              className="form-control"
              placeholder="Case ID enter karo..."
              value={searchCaseId}
              // onChange = har keystroke pe yeh function chale
              onChange={(e) => setSearchCaseId(e.target.value)}
            />
            <button
              className="btn btn-outline-primary"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ADD JUDGE FORM — sirf tab dikhao jab showForm true ho */}
      {showForm && (
        // "&&" matlab: agar condition true hai toh jo baad mein hai woh render karo
        <div className="card mb-4 shadow-sm border-primary">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0">       Naya Judge Add Karo</h6>
          </div>
          <div className="card-body">
            {/* onSubmit = form submit hone pe handleSubmit function chale */}
            <form onSubmit={handleSubmit}>

              {/* ROW 1: Case ID aur Judge Name */}
              <div className="row g-3 mb-3">
                {/* g-3 = grid gap */}

                <div className="col-md-6">
                  {/* col-md-6 = medium screen pe aadhi width lo (12 mein se 6) */}
                  <label className="form-label">
                    Case ID <span className="text-danger">*</span>
                    {/* text-danger = red color — required field hai */}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="caseId"
                    // name = handleInputChange mein e.target.name se milega
                    value={formData.caseId}
                    onChange={handleInputChange}
                    placeholder="e.g. abc-123-def"
                    required
                    // required = HTML5 validation — empty submit nahi hoga
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Judge Ka Naam <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="judgeName"
                    value={formData.judgeName}
                    onChange={handleInputChange}
                    placeholder="e.g. Justice Muhammad Ali"
                    required
                  />
                </div>
              </div>

              {/* ROW 2: Contact No aur Email */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Contact Number (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="judgeContactNo"
                    value={formData.judgeContactNo || ''}
                    // "|| ''" = agar null hai toh empty string dikhao
                    onChange={handleInputChange}
                    placeholder="e.g. 0300-1234567"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="judgeEmail"
                    value={formData.judgeEmail || ''}
                    onChange={handleInputChange}
                    placeholder="judge@court.gov.pk"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isCreating}
                  // disabled = jab isCreating true ho toh button click nahi hoga
                >
                  {isCreating ? ' Save ho raha hai...' : ' Judge Save Karo'}
                  {/* Ternary operator: condition ? agar true : agar false */}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* BENCH TABLE — Judges ki list */}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">📋 Judges Ki List</h6>
          {activeCaseId && (
            <span className="badge bg-secondary">Case: {activeCaseId}</span>
          )}
        </div>
        <div className="card-body p-0">

          {/* LOADING STATE */}
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                {/* spinner-border = Bootstrap loading spinner */}
              </div>
              <p className="mt-2 text-muted">Data load ho raha hai...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {isError && (
            <div className="alert alert-danger m-3">
               Data load nahi hua. Check karo ke backend chal raha hai.
            </div>
          )}

          {/* NO CASE ID STATE — agar abhi tak search nahi kiya */}
          {!activeCaseId && !isLoading && (
            <div className="text-center py-5 text-muted">
              <p style={{ fontSize: '3rem' }}>⚖️</p>
              <p>Upar Case ID enter karo judges dekhne ke liye</p>
            </div>
          )}

          {/* DATA TABLE — sirf tab dikhao jab data ho */}
          {benchList && benchList.length > 0 && (
            <div className="table-responsive">
              {/* table-responsive = chhoti screen pe scroll kar sako */}
              <table className="table table-hover mb-0">
                {/* table-hover = mouse hover pe row highlight ho */}
                <thead className="table-dark">
                  <tr>
                    {/* th = table header cell */}
                    <th>#</th>
                    <th>Judge Ka Naam</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* .map() = array ke har item ke liye ek table row banao */}
                  {/* index = current item ka number (0 se start) */}
                  {benchList.map((bench, index) => (
                    <tr key={bench.id}>
                      {/* key = React ko unique ID chahiye — list items ke liye zaroori */}
                      <td>{index + 1}</td>
                      {/* +1 kyunki array 0 se start hota hai, user ko 1 se dikhao */}
                      <td>
                        <strong>{bench.judgeName}</strong>
                      </td>
                      <td>{bench.judgeContactNo || '—'}</td>
                      {/* "|| '—'" = agar null hai toh dash dikhao */}
                      <td>{bench.judgeEmail || '—'}</td>
                      <td>
                        {/* Date format karna — string ko readable format mein */}
                        {new Date(bench.createdAt).toLocaleDateString('en-PK')}
                      </td>
                      <td>
                        {/* DELETE BUTTON */}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(bench.id)}
                          disabled={isDeleting}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EMPTY STATE — data hai hi nahi is case mein */}
          {benchList && benchList.length === 0 && activeCaseId && (
            <div className="text-center py-5 text-muted">
              <p style={{ fontSize: '2rem' }}>📭</p>
              <p>Is case mein abhi koi judge nahi hai</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowForm(true)}
              >
                + Pehla Judge Add Karo
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Component ko export karo taake router/index.tsx mein import ho sake
export default BenchPage;
