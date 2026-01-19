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
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Donate Blood, <span className="text-yellow-300">Save Lives</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed font-medium">
            Your donation can give someone another chance at life. Join our
            exclusive community of heroes today.
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
              <FaSearch /> Search Donors
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-base-200 shadow-2xl rounded-3xl p-8 border border-base-300 backdrop-blur-md">
            {[
              {
                label: "Blood Donors",
                value: "500+",
                icon: <FaUsers />,
                color: "text-primary",
              },
              {
                label: "Lives Saved",
                value: "1000+",
                icon: <FaHandHoldingHeart />,
                color: "text-secondary",
              },
              {
                label: "Blood Camps",
                value: "50+",
                icon: <FaHospital />,
                color: "text-accent",
              },
              {
                label: "Support",
                value: "24/7",
                icon: <FaQuestionCircle />,
                color: "text-info",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <div className={`${stat.color} text-3xl mb-3`}>{stat.icon}</div>
                <h3 className="text-3xl md:text-4xl font-black">
                  {stat.value}
                </h3>
                <p className="text-base-content/70 font-semibold uppercase tracking-widest text-xs mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Donate Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="badge badge-primary badge-outline mb-4 p-4 font-bold uppercase">
            Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Why Donate Blood?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                emoji: "🩸",
                title: "Save Lives",
                text: "A single drop of your blood could be the reason someone smiles again.",
              },
              {
                emoji: "❤️",
                title: "Health Benefits",
                text: "Improve your cardiovascular health and maintain iron levels naturally.",
              },
              {
                emoji: "🤝",
                title: "Community Support",
                text: "Build a stronger, safer society by being there in times of medical crisis.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group p-10 rounded-3xl bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {card.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-base-content/60 leading-relaxed">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Donation Process */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between gap-8 text-center">
            {[
              {
                step: "01",
                title: "Registration",
                desc: "Create a donor profile with your blood group.",
              },
              {
                step: "02",
                title: "Screening",
                desc: "Brief health examination by medical experts.",
              },
              {
                step: "03",
                title: "Donation",
                desc: "The process is safe and takes only 10 minutes.",
              },
              {
                step: "04",
                title: "Rest",
                desc: "Relax with some snacks before you head out.",
              },
            ].map((item, i) => (
              <div key={i} className="flex-1 relative">
                <div className="text-7xl font-black text-primary/10 absolute -top-10 left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-3 relative z-10">
                  {item.title}
                </h4>
                <p className="text-base-content/60 text-sm relative z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Section with Pexels Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Donation"
              className="rounded-[2rem] shadow-3xl w-full object-cover h-[500px]"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-8">Modern Features</h2>
            <div className="space-y-6">
              {[
                {
                  t: "Verified Donors",
                  d: "A database of verified and active donors.",
                },
                {
                  t: "Urgent Requests",
                  d: "Post blood requests and get notified in real-time.",
                },
                {
                  t: "Advanced Dashboard",
                  d: "Track your donation history and manage profile.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-base-200 transition-colors"
                >
                  <FaCheckCircle className="text-primary text-2xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">{f.t}</h4>
                    <p className="text-base-content/60">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Real Heroes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card bg-base-100 text-base-content p-8 shadow-xl"
              >
                <FaQuoteLeft className="text-primary text-3xl mb-6 opacity-20" />
                <p className="mb-8 italic">
                  "I could find a donor for my sister's emergency surgery in
                  just minutes. Highly recommended!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-white rounded-full w-12">
                      <span>JD</span>
                    </div>
                  </div>
                  <div className="text-left font-bold">Alex Johnson</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Common Questions
          </h2>
          <div className="join join-vertical w-full bg-base-200">
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-bold">
                How often can I donate?
              </div>
              <div className="collapse-content">
                <p>You can donate whole blood every 8 weeks.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-bold">
                Is it safe?
              </div>
              <div className="collapse-content">
                <p>
                  Yes, the process is completely safe and supervised by
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Blogs Section with Pexels Images */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Stay Informed</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg",
              "https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg",
              "https://images.pexels.com/photos/6749780/pexels-photo-6749780.jpeg",
            ].map((img, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-sm hover:shadow-2xl overflow-hidden"
              >
                <figure>
                  <img
                    src={`${img}?auto=compress&cs=tinysrgb&w=600`}
                    alt="Blog"
                    className="h-56 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h4 className="card-title font-bold">Safe Practices 2024</h4>
                  <p className="text-sm opacity-70">
                    Everything you need to know about staying healthy after
                    donation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-secondary to-primary rounded-[3rem] p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Heroic.</h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="hero@example.com"
              className="input input-lg w-full text-gray-800"
            />
            <button className="btn btn-lg bg-neutral text-white border-none">
              Join
            </button>
          </div>
        </div>
      </section>

      {/* 10. Call to Action */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 italic italic">
            READY TO HELP?
          </h2>
          <Link
            to="/register"
            className="btn btn-xl btn-primary shadow-2xl rounded-full px-12"
          >
            Become a Donor
          </Link>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 text-[20rem] font-black pointer-events-none">
          BLOOD
        </div>
      </section>
    </div>
  );
};

export default Home;
