import Link from 'next/link';
import Image from 'next/image';
import ItemMarquee from '@/components/ItemMarque';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import Clinic from '@/components/ClinicMap';
import OverviewStats from '@/components/OverviewStats';

export default function Home() {
  return (
    <div className="container-fluid p-0 m-0 bg-white">
      {/* Banner */}
      <div className="w-100 position-relative" style={{ height: '400px' }}>
        <Image 
          src="/Img/Slider.png" 
          alt="Medfix Header"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Welcome Content Area */}
      <div className="d-flex flex-column align-items-center justify-content-center py-5 border-bottom">
        <h1 className="text-primary fw-bold mb-3">Welcome to Medfix</h1>
        <p className="text-secondary text-center mb-4 px-3" style={{ maxWidth: '700px' }}>
          Manage your health with ease. Log in or create an account to schedule your next appointment.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link href="/login" className="btn btn-primary btn-lg px-4 shadow-none">Login</Link>
          <Link href="/register" className="btn btn-outline-primary btn-lg px-4 shadow-none">Register</Link>
        </div>
      </div>

      <OverviewStats />

      {/*Vision & Mission Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100">
                <h3 className="text-primary fw-bold mb-3">Our Vision</h3>
                <p className="text-secondary mb-0">
                  To revolutionize the patient experience by creating a world where 
                  healthcare is just a click away, making medical accessibility 
                  completely seamless and borderless for every community.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 border-start border-primary border-5">
                <h3 className="text-primary fw-bold mb-3">Our Mission</h3>
                <p className="text-secondary mb-0">
                  Our mission is to empower patients with the tools to **effortlessly 
                  schedule, manage, and track their medical bookings in real-time**. 
                  By eliminating administrative hurdles, we provide a more convenient 
                  path to wellness through organized and transparent healthcare management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Marquee section */}
      <ItemMarquee />
      
      {/* Feedback section */}
      <FeedbackDisplay />

      {/* Clinic Map section */}
      <Clinic />
    </div>
  );
}