<section id="about" className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      
      {/* Left Content */}
      <div>
        <h2 className="text-green-600 font-semibold text-sm uppercase tracking-wide">
          About Us
        </h2>
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-2">
          About Solar Village: Empowering Farmers
        </h3>
        <p className="text-gray-700 mt-4 leading-relaxed">
          Solar Village was founded in 2019 by <span className="font-semibold">Ato Lebeza Alemu</span>,
          a diaspora professional returning home to contribute to Ethiopia after more than
          40 years of experience abroad. His mission is to support smallholder farmers with clean,
          reliable, and affordable solar-powered agricultural technologies.
        </p>

        <div className="flex items-center gap-4 mt-6">
          <div className="bg-green-600 text-white w-20 h-20 flex items-center justify-center rounded-xl shadow-lg">
            <span className="text-3xl font-bold">7</span>
          </div>
          <p className="text-lg font-medium text-gray-800">
            Years of Experience <br />
            <span className="text-gray-600 text-sm">
              Transforming lives through solar solutions
            </span>
          </p>
        </div>

        <p className="text-gray-700 mt-6 leading-relaxed">
          Inspired by a visit to rural Ethiopia where farmers relied on expensive diesel
          pumps, he launched Solar Village to introduce solar irrigation, urban farming,
          and sustainable agriculture solutions — reducing costs, boosting yields, and
          improving livelihoods while protecting the environment.
        </p>

        <button
          onClick={() => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })}
          className="mt-8 inline-block bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-md font-medium"
        >
          View More
        </button>
      </div>

      {/* Right Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        <img
          src="/assets/irrigating-crops.jpg"
          alt="Irrigating Crops"
          className="w-full h-56 object-cover rounded-lg shadow-md"
        />
        <img
          src="/assets/photo_2025-08-20_09-49-37.jpg"
          alt="Solar Village Field Work"
          className="w-full h-56 object-cover rounded-lg shadow-md"
        />
        <div className="col-span-2 bg-green-50 px-6 py-6 rounded-lg shadow-inner">
          <h4 className="font-bold text-gray-900 text-lg">ABOUT COMPANY</h4>
          <p className="text-gray-700 mt-2 text-sm">
            Empowering Farmers with Solar Solutions for a Sustainable Future — our technology
            enables efficient farming and promotes renewable energy across Ethiopia.
          </p>
        </div>
      </div>
    </div>

    {/* Mission / Vision / Values */}
    <div className="mt-20 grid md:grid-cols-3 gap-6">
      <div className="p-6 border rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition">
        <h5 className="font-bold text-lg text-green-700">Our Mission</h5>
        <p className="text-gray-700 mt-3 text-sm">
          To revolutionize smallholder farming by delivering affordable and sustainable
          solar-powered agricultural solutions.
        </p>
      </div>

      <div className="p-6 border rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition">
        <h5 className="font-bold text-lg text-green-700">Our Vision</h5>
        <p className="text-gray-700 mt-3 text-sm">
          To become Ethiopia’s leading provider of solar agriculture solutions and help
          rural communities achieve energy independence and economic resilience.
        </p>
      </div>

      <div className="p-6 border rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition">
        <h5 className="font-bold text-lg text-green-700">Our Core Values</h5>
        <ul className="text-gray-700 list-disc mt-3 pl-5 text-sm space-y-1">
          <li>Innovation for farmers</li>
          <li>Environmental sustainability</li>
          <li>Community empowerment</li>
          <li>Integrity and accountability</li>
        </ul>
      </div>
    </div>

  </div>
</section>
