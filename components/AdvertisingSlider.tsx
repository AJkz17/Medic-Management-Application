const AdvertSlider = () => {
    return(

    <div id="promoCarousel" className="carousel slide mb-5 shadow-sm rounded overflow-hidden" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
              <div className="text-center p-3">
                <h3 className="fw-bold">New Health Screening Packages</h3>
                <p>Get 20% off for first-time visitors this month!</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="bg-success text-white d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
              <div className="text-center p-3">
                <h3 className="fw-bold">Vaccination Drive 2026</h3>
                <p>Protect your family. Book your flu shot today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
}

export default AdvertSlider