'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitFeedback } from "@/lib/actions";

interface Doctor {
  id: number;
  name: string;
  department: string;
}

export default function Feedback() {
    const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
    const [selectedDocId, setSelectedDocId] = useState(""); 
    const [rating, setRating] = useState(0);       
    const [hover, setHover] = useState(0);        
    
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadDoctor() {
            try {
                const response = await fetch("/api/feedback");
                if (!response.ok) throw new Error("Failed to fetch doctors");
                const data = await response.json();
                setDoctorsList(data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        }
        loadDoctor();
    }, []);

    const currentDoctor = doctorsList.find(doc => doc.id === parseInt(selectedDocId));

    const handleFormAction = async (formData: FormData) => {
        if (!selectedDocId) return alert("Please select a doctor.");
        if (rating === 0) return alert("Please provide a star rating.");

        const res = await submitFeedback(formData);

        if (res.success) {
            alert(res.message);
            setRating(0);
            setSelectedDocId("");
            formRef.current?.reset(); 
            router.refresh();
        } else {
            alert("Error: " + res.message);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="text-primary fw-bold text-center mb-5">Patient Feedback Portal</h1>

            {/* --- SIDE BY SIDE TWO-COLUMN GRID CONTAINER --- */}
            <div className="row align-items-center justify-content-center g-4"> 
                
                {/* LEFT COLUMN: BRAND PROMOTIONAL ILLUSTRATION COMPONENT (Swapped to Left) */}
                <div className="col-lg-5 col-md-6 text-center">
                    <div className="p-3">
                        <img 
                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" 
                            alt="Medical Feedback Review Illustration" 
                            className="img-fluid rounded shadow-sm object-fit-cover"
                            style={{ maxHeight: '420px', width: '100%', borderRadius: '15px' }}
                        />
                        <p className="text-muted small mt-3 italic">
                            "Your constructive insights help our clinical staff maintain exceptional medical standards daily."
                        </p>
                    </div>
                </div>

                {/* MIDDLE COLUMN: THE VISUAL DIVIDER SEPARATOR LINE */}
                <div className="col-lg-1 d-none d-lg-flex justify-content-center align-items-center">
                    <div className="bg-secondary bg-opacity-25" style={{ width: '2px', height: '400px' }}></div>
                </div>

                {/* RIGHT COLUMN: THE FEEDBACK INTERACTION FORM (Swapped to Right) */}
                <div className="col-lg-5 col-md-6">
                    <div className="card shadow-sm border-0">
                        <form ref={formRef} action={handleFormAction} className="card-body p-4">
                            <h5 className="card-title mb-3 fw-bold text-dark">Give Feedback</h5>
                            <p className="card-text text-muted small">Please provide your feedback on our medical service.</p>
                            
                            <input type="hidden" name="rating" value={rating} />

                            {/* Doctor Selection Dropdown */}
                            <div className="mb-3">
                                <label htmlFor="doctorSelect" className="form-label fw-bold small text-muted mb-1">Select Doctor</label>
                                <select 
                                    id="doctorSelect" 
                                    name="doctorId" 
                                    className="form-select" 
                                    value={selectedDocId} 
                                    onChange={(e) => setSelectedDocId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctorsList.map((doc) => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dynamic Doctor Preview Metadata Card */}
                            {currentDoctor && (
                                <div className="mb-3 p-3 bg-light rounded border-start border-primary border-3 transition-all">
                                    <label className="form-label fw-bold small text-muted mb-0">Selected Specialist</label>
                                    <p className="mb-0 fw-semibold text-dark fs-5">{currentDoctor.name}</p>
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 mt-1">
                                        {currentDoctor.department}
                                    </span>
                                </div>
                            )}

                            {/* Interactive Star Rating Selection Module */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted mb-1">Your Rating</label>
                                <div className="d-flex gap-2 align-items-center">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = star <= (hover || rating);
                                        return (
                                            <button
                                                type="button"
                                                key={star}
                                                className="btn btn-link p-0 border-0 shadow-none text-decoration-none"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                style={{ fontSize: '2rem', transition: 'transform 0.1s' }}
                                            >
                                                <span className={isFilled ? "text-warning" : "text-secondary opacity-50"}>
                                                    {isFilled ? '★' : '☆'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                    {rating > 0 && <span className="text-muted small ms-2 fw-medium">({rating}/5)</span>}
                                </div>
                            </div>

                            {/* Additional Free-Text Comment Box */}
                            <div className="mb-4">
                                <label htmlFor="comments" className="form-label fw-bold small text-muted mb-1">Additional Comments</label>
                                <textarea 
                                    className="form-control" 
                                    id="comments" 
                                    name="comments" 
                                    rows={3} 
                                    placeholder="Write your feedback here..."
                                ></textarea>        
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-semibold shadow-sm">
                                Submit Feedback
                            </button>
                        </form>
                    </div>  
                </div>

            </div>
        </div>
    );
}