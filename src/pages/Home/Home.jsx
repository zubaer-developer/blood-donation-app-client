import { Link } from "react-router-dom";
import {
  FaHandHoldingHeart,
  FaSearch,
  FaQuoteLeft,
  FaQuestionCircle,
  FaEnvelope,
  FaHospital,
  FaUsers,
  FaSyringe,
  FaCheckCircle,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Give the Gift of <span className="text-yellow-300">Life</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed font-medium">
            Connect with donors instantly and help those in urgent need. Your
            small contribution can be a miracle for someone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="btn btn-lg bg-white border-none text-primary hover:bg-yellow-300 hover:scale-105 transition-all shadow-2xl px-10"
            >
              <FaHandHoldingHeart className="text-xl" /> Join as a Donor
            </Link>
            <Link
              to="/search"
              className="btn btn-lg btn-outline text-white border-2 hover:bg-white hover:text-secondary px-10 border-white/50"
            >
              <FaSearch /> Find Blood Now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-base-200 shadow-2xl rounded-3xl p-8 border border-base-300 backdrop-blur-md">
            <div className="flex flex-col items-center p-4 text-center">
              <FaUsers className="text-primary text-3xl mb-3" />
              <h3 className="text-3xl md:text-4xl font-black">5.2k</h3>
              <p className="text-base-content/70 font-semibold uppercase tracking-widest text-xs mt-1">
                Verified Donors
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <FaHandHoldingHeart className="text-secondary text-3xl mb-3" />
              <h3 className="text-3xl md:text-4xl font-black">12k</h3>
              <p className="text-base-content/70 font-semibold uppercase tracking-widest text-xs mt-1">
                Successful Cases
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <FaHospital className="text-accent text-3xl mb-3" />
              <h3 className="text-3xl md:text-4xl font-black">85+</h3>
              <p className="text-base-content/70 font-semibold uppercase tracking-widest text-xs mt-1">
                Partner Hospitals
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <FaCalendarAlt className="text-info text-3xl mb-3" />
              <h3 className="text-3xl md:text-4xl font-black">150+</h3>
              <p className="text-base-content/70 font-semibold uppercase tracking-widest text-xs mt-1">
                Monthly Camps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Purpose Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="badge badge-primary badge-outline mb-4 p-4 font-bold uppercase">
            Our Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            The Power of Donation
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group p-10 rounded-3xl bg-base-200 border border-base-300 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-6">🚑</div>
              <h3 className="text-2xl font-bold mb-4">Emergency Support</h3>
              <p className="text-base-content/60 leading-relaxed">
                We provide critical blood supply during accidents and surgeries
                when every second counts.
              </p>
            </div>
            <div className="group p-10 rounded-3xl bg-base-200 border border-base-300 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-6">🧬</div>
              <h3 className="text-2xl font-bold mb-4">Rare Groups</h3>
              <p className="text-base-content/60 leading-relaxed">
                Our platform helps locate rare blood types that are often
                difficult to find in traditional banks.
              </p>
            </div>
            <div className="group p-10 rounded-3xl bg-base-200 border border-base-300 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-6">🌿</div>
              <h3 className="text-2xl font-bold mb-4">Free Checkups</h3>
              <p className="text-base-content/60 leading-relaxed">
                Every donor gets a complimentary health screening and blood test
                report before donation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Simple 4-Step Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative p-6">
              <div className="text-6xl font-black text-primary/10 absolute top-0 left-1/2 -translate-x-1/2">
                01
              </div>
              <h4 className="text-xl font-bold mb-3 relative z-10">
                Quick Sign Up
              </h4>
              <p className="text-base-content/60 text-sm">
                Register your profile and choose your blood group.
              </p>
            </div>
            <div className="relative p-6">
              <div className="text-6xl font-black text-primary/10 absolute top-0 left-1/2 -translate-x-1/2">
                02
              </div>
              <h4 className="text-xl font-bold mb-3 relative z-10">
                Health Check
              </h4>
              <p className="text-base-content/60 text-sm">
                Our medical team ensures you are fit to donate blood.
              </p>
            </div>
            <div className="relative p-6">
              <div className="text-6xl font-black text-primary/10 absolute top-0 left-1/2 -translate-x-1/2">
                03
              </div>
              <h4 className="text-xl font-bold mb-3 relative z-10">
                Safe Donation
              </h4>
              <p className="text-base-content/60 text-sm">
                Professional staff handles the process in a clean environment.
              </p>
            </div>
            <div className="relative p-6">
              <div className="text-6xl font-black text-primary/10 absolute top-0 left-1/2 -translate-x-1/2">
                04
              </div>
              <h4 className="text-xl font-bold mb-3 relative z-10">
                Relax & Refresh
              </h4>
              <p className="text-base-content/60 text-sm">
                Enjoy refreshments and receive your donor certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <img
            src="https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=1260"
            alt="Blood Donation Team"
            className="rounded-[2rem] shadow-3xl w-full object-cover h-[500px]"
          />
          <div>
            <h2 className="text-4xl font-bold mb-8 italic">
              Smart Donor Management
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-base-200">
                <FaShieldAlt className="text-primary text-2xl mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Identity Verification</h4>
                  <p className="text-base-content/60 text-sm">
                    All donors are verified through government-issued ID and
                    phone number.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-base-200">
                <FaSyringe className="text-secondary text-2xl mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Instant Alerts</h4>
                  <p className="text-base-content/60 text-sm">
                    Get real-time SMS and app notifications for urgent requests
                    in your city.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-base-200">
                <FaCheckCircle className="text-accent text-2xl mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">History Tracking</h4>
                  <p className="text-base-content/60 text-sm">
                    Keep a record of your donations and know when you are
                    eligible again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Stories of Survival</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 text-base-content p-8 shadow-xl">
              <FaQuoteLeft className="text-primary text-2xl mb-4" />
              <p className="mb-8 italic">
                "The search feature is incredible! I found an O-negative donor
                for my father in just 15 minutes during an emergency."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/150?u=rahul"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left font-bold">Rahul Ahmed</div>
              </div>
            </div>
            <div className="card bg-base-100 text-base-content p-8 shadow-xl">
              <FaQuoteLeft className="text-primary text-2xl mb-4" />
              <p className="mb-8 italic">
                "Being a regular donor here makes me feel like a hero. The
                process is smooth and very well organized."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/150?u=sarah"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left font-bold">Sarah Williams</div>
              </div>
            </div>
            <div className="card bg-base-100 text-base-content p-8 shadow-xl">
              <FaQuoteLeft className="text-primary text-2xl mb-4" />
              <p className="mb-8 italic">
                "I requested blood for a Thalassemia patient and received over
                10 calls within an hour. Amazing community support!"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/150?u=karim"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left font-bold">Karim Ullah</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">General FAQ</h2>
          <div className="join join-vertical w-full bg-base-200">
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-xl font-bold">
                Who is eligible to donate?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Anyone aged 18-60, weighing above 50kg, and in good health.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-bold">
                Will it weaken my immune system?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  No, your body replenishes the lost fluid within 48 hours and
                  cells within weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Recent Blogs */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Health Tips & Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <figure>
                <img
                  src="https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&w=600"
                  alt="Diet"
                  className="h-56 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h4 className="card-title font-bold">Post-Donation Diet</h4>
                <p className="text-sm opacity-70">
                  Foods to eat to recover faster and boost your energy levels
                  instantly.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <figure>
                <img
                  src="https://images.pexels.com/photos/3952124/pexels-photo-3952124.jpeg?auto=compress&w=600"
                  alt="Checkup"
                  className="h-56 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h4 className="card-title font-bold">
                  Importance of Screening
                </h4>
                <p className="text-sm opacity-70">
                  Why medical checkups are vital before you sit for a donation
                  session.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <figure>
                <img
                  src="https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&w=600"
                  alt="Blood"
                  className="h-56 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h4 className="card-title font-bold">
                  Understanding Blood Types
                </h4>
                <p className="text-sm opacity-70">
                  A complete guide to ABO and Rh blood groups and their
                  compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-linear-to-r from-secondary to-primary rounded-[3rem] p-12 text-center text-white shadow-2xl">
          <FaEnvelope className="text-5xl mx-auto mb-6 opacity-30" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Never Miss a Request
          </h2>
          <p className="mb-10 text-lg opacity-90 max-w-2xl mx-auto">
            Get monthly health tips and urgent blood alerts directly in your
            inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Email Address"
              className="input input-lg w-full text-gray-800"
            />
            <button className="btn btn-lg bg-neutral text-white border-none px-8">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* 10. Call to Action */}
      <section className="py-24 text-center relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 italic">
            START SAVING LIVES
          </h2>
          <Link
            to="/register"
            className="btn btn-xl btn-primary shadow-2xl rounded-full px-12 transform hover:scale-110 transition-all"
          >
            Register As Donor
          </Link>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 text-[20rem] font-black select-none pointer-events-none">
          HERO
        </div>
      </section>
    </div>
  );
};

export default Home;
