// components/FeedbackDisplay.tsx
import Image from "next/image";
import { patientFeedback } from "@/assets/assets"; // Double check your path matches your project layout

const FeedbackDisplay = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-5">What Our Patients Say</h2>
      
      {/* The row will now dynamically wrap columns as data items scale */}
      <div className="row g-4 justify-content-center">
        {patientFeedback.map((feedback) => (
          <div key={feedback.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <div className="card-body d-flex flex-column justify-content-between">
                
                <div>
                  {/* Avatar & Rating Header Alignment block */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div 
                      className="position-relative rounded-circle overflow-hidden border border-light shadow-sm" 
                      style={{ width: "45px", height: "45px", flexShrink: 0 }}
                    >
                      <Image
                        src={feedback.image}
                        alt={`${feedback.name}'s Profile`}
                        fill
                        className="object-fit-cover"
                      />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{feedback.name}</h6>
                      <small className="text-muted">{feedback.role}</small>
                    </div>
                  </div>

                  {/* Star Rating Render Block */}
                  <div className="text-warning mb-3 small">{feedback.stars}</div>

                  {/* Patient Review Text block */}
                  <p className="card-text fst-italic text-secondary">
                    "{feedback.comment}"
                  </p>
                </div>

                {/* Card Divider Footer block */}
                <div>
                  <hr className="text-muted opacity-25 my-3" />
                  <span className="text-muted small fw-medium">Verified Appointment</span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDisplay;