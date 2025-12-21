import { Link } from "react-router-dom";
import { FaHandHoldingHeart } from "react-icons/fa";
const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="bg-linear-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Donate Blood, Save Lives
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your donation can give someone another chance at life. Join our
            community of heroes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <Link
                to="/register"
                className="bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-yellow-300 hover:text-secondary transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <FaHandHoldingHeart size={20} />
                <span>Join as a Donor</span>
              </Link>
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors">
              Search Donors
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-gray-600">Blood Donors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-gray-600">Lives Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-gray-600">Blood Camps</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Donate Blood?</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Blood donation is a simple act that can make a huge difference in
            someone's life.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-blood">
              <div className="text-4xl mb-4">🩸</div>
              <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
              <p className="text-gray-600">
                One donation can save up to 3 lives
              </p>
            </div>
            <div className="card-blood">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
              <p className="text-gray-600">
                Regular donation improves cardiovascular health
              </p>
            </div>
            <div className="card-blood">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Help your community in times of need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============== CTA SECTION =============== */}
      <section className="py-16 bg-linear-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of heroes who donate blood regularly. Your
            contribution matters.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary font-semibold px-10 py-4 rounded-lg hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Become a Donor Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
