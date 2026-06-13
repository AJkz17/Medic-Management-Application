'use client';

import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  { id: 1, name: "Ruka", role: "Main Dancer & Rapper", bio: "The oldest member from Japan, bringing sharp dance moves and powerful rap verses to Medfix." },
  { id: 2, name: "Pharita", role: "Main Vocalist", bio: "Hailing from Thailand, her elegant and crystal-clear vocals represent our harmonious team vision." },
  { id: 3, name: "Asa", role: "Main Rapper", bio: "A dual-threat from Japan known for her lightning-fast rap speed and incredible stage presence." },
  { id: 4, name: "Ahyeon", role: "Center & All-Rounder", bio: "The 'ace' of the group, balancing power vocals and rap to lead our creative direction." },
  { id: 5, name: "Rami", role: "Lead Vocalist", bio: "Possessing deep, soulful vocals that provide the strong foundation for our team’s success." },
  { id: 6, name: "Rora", role: "Lead Vocalist", bio: "A versatile performer with a unique vocal tone that adds a classic touch to our modern approach." },
  { id: 7, name: "Chiquita", role: "Maknae & Lead Dancer", bio: "The energetic youngest member from Thailand, representing our brand's youthful and bright future." },
];

export default function TeamPage() {
  return (
    <div className="container-fluid p-0 bg-white">
      <div className="bg-dark text-white py-5 position-relative">
        <div className="container position-relative" style={{ zIndex: 2 }}>
            <Link href="/about" className="btn btn-outline-info btn-sm mb-4 text-decoration-none">
                ← Back to About
            </Link>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <h1 className="display-4 fw-bold mb-3 text-info">Medfix</h1>
              <p className="lead opacity-75">
                Meet the seven talented individuals leading the next generation of healthcare innovation. 
                Like the members of BABYMONSTER, we believe in talent, hard work, and global vision.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden border border-info border-2 shadow-lg position-relative" style={{ height: '350px' }}>
                <Image 
                  src="/Img/BabymonsterGP.jpg" 
                  alt="BABYMONSTER Group"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">Our Leaders</h2>
        <div className="row g-4 justify-content-center">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 card-hover-effect overflow-hidden">
                <div className="position-relative" style={{ height: '280px' }}>
                  <Image src={`/Img/member-${member.name.toLowerCase()}.jpg`} alt={member.name}fill style={{ objectFit: 'cover' }}/>
                </div>
                <div className="card-body text-center">
                  <h5 className="fw-bold mb-1 text-dark">{member.name}</h5>
                  <p className="text-info small fw-bold mb-2">{member.role}</p>
                  <p className="text-secondary smaller mb-0" style={{ fontSize: '0.8rem' }}> {member.bio} </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}