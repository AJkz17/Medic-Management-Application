import ImageSlider from "@/components/ImageSlider";
import Link from 'next/link';

export default function About() {
    return (
        <div className="container-fluid p-0 m-0 bg-white flex-column min-vh-100">
            {/* 1. Welcome & Slider */}
            <div className="text-center py-4">
                <h1 className="text-primary fw-bold">Welcome to Medfix!</h1>
                <p className="text-muted">A convenient way to book and track your medical appointments.</p>
            </div>

            <div className="w-70% p-0 m-0 overflow-hidden">
                <ImageSlider />
            </div>

            {/* 2. Who We Are Section (Blue Curved Background) */}
            <div className="position-relative" style={{ backgroundColor: '#002651', padding: '100px 0 160px 0', clipPath: 'ellipse(150% 100% at 50% 100%)' }}>
                <div className="container">
                    <div className="row text-white align-items-start">
                        {/* Heading Moved to Top/Side */}
                        <div className="col-md-3 mb-4 mb-md-0 border-start border-info border-4 ps-4">
                            <h2 className="fw-bold m-0" style={{ lineHeight: '1.2' }}>WHO<br />WE<br />ARE?</h2>
                        </div>
                        
                        {/* Description */}
                        <div className="col-md-9">
                            <p className="lead opacity-75">
                                Medfix is a dedicated healthcare platform focused on bridging the gap between patients and doctors. 
                                We believe that medical care should be accessible and organized. Our system is built to ensure 
                                that <strong>patients</strong> can navigate their health journey without the stress of 
                                traditional administrative hurdles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. The 3 Overlapping Cards */}
            <div className="container" style={{ marginTop: '-100px', zIndex: 10, position: 'relative' }}>
                <div className="row g-4 justify-content-center">
                    
                    {/* Mission Card */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-lg p-4 rounded-4 h-100 card-hover-effect">
                            <div className="mb-3 icon-box">
                                <i className="bi bi-calendar-check text-info fs-1"></i>
                            </div>
                            <h4 className="fw-bold text-dark">OUR MISSION</h4>
                            <p className="text-secondary small">
                                To empower patients by providing a seamless interface to <strong>manage and track bookings</strong>. 
                                We aim to provide maximum convenience by putting your medical schedule right at your fingertips.
                            </p>
                            <div className="mt-auto text-end text-info fs-4 arrow-move">→</div>
                        </div>
                    </div>

                    {/* Vision Card */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-lg p-4 rounded-4 h-100 card-hover-effect">
                            <div className="mb-3 icon-box">
                                <i className="bi bi-eye text-info fs-1"></i>
                            </div>
                            <h4 className="fw-bold text-dark">OUR VISION</h4>
                            <p className="text-secondary small">
                                To become the most trusted digital health companion, where every patient has the clarity and 
                                tools needed to maintain a healthy, organized lifestyle through smart technology.
                            </p>
                            <div className="mt-auto text-end text-info fs-4 arrow-move">→</div>
                        </div>
                    </div>

                    {/* Team Card */}
                   <div className="col-md-4">
                    <div className="card border-0 shadow-lg p-4 rounded-4 h-100 card-hover-effect">
                        <div className="mb-3 icon-box">
                            <i className="bi bi-people text-info fs-1"></i>
                        </div>
                        <h4 className="fw-bold text-dark">OUR TEAM</h4>
                        <p className="text-secondary small">
                            Our team consists of passionate developers and health specialists committed to building 
                            a safer, more transparent, and highly efficient booking environment for everyone.
                        </p>
                        
                        {/* 2. Wrap the arrow in a Link component */}
                        <div className="mt-auto text-end">
                            <Link href="/about/blog" className="text-decoration-none text-info fs-4 arrow-move">
                                See our team →
                            </Link>
                        </div>
                    </div>
                </div>

                </div>
            </div>

            <div className="py-5"></div>
        </div>
    );
}