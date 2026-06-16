import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us | Clover Clothing",
  description:
    "Learn about Clover Clothing — our story, our mission, and our commitment to sustainable, premium cotton fashion.",
};

export default function AboutPage() {
  const values = [
    {
      icon: "🌱",
      title: "Sustainable Sourcing",
      description:
        "We partner only with farms and mills that meet strict environmental and ethical standards.",
    },
    {
      icon: "✂️",
      title: "Premium Craftsmanship",
      description:
        "Every garment is cut, stitched, and finished by skilled artisans who take pride in their work.",
    },
    {
      icon: "🤝",
      title: "Fair Trade",
      description:
        "We believe everyone in our supply chain deserves fair pay and safe working conditions.",
    },
    {
      icon: "♻️",
      title: "Low Waste",
      description:
        "Our packaging is 100% recyclable and we donate excess fabric to local tailoring schools.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            We Make Clothing <span className="text-green-600">You Can Feel Good About</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Clover Clothing was founded in 2022 with a simple belief: that style and sustainability
            don't have to be in conflict. Every piece we make starts with premium cotton — sourced
            responsibly, crafted carefully, and designed to last.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            From our signature Punjabi kurtas to our everyday organic tees, each item is a
            reflection of our commitment to quality, comfort, and conscious fashion. We're based in
            Bangladesh, home to some of the world's finest textile artisans, and we're proud to
            support local communities through every stitch.
          </p>
          <Link
            href="/items"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Shop the Collection
          </Link>
        </div>

        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/kurta1.jpg"
            alt="Clover Clothing craftsmanship"
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-sm font-medium opacity-80">Est. 2022</p>
            <p className="text-xl font-bold">Clover Clothing</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { value: "3+", label: "Years in Business" },
          { value: "500+", label: "Products Sold" },
          { value: "100%", label: "Cotton Certified" },
          { value: "4.8★", label: "Customer Rating" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow p-6 text-center"
          >
            <p className="text-3xl font-bold text-green-600">{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Our Values */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="text-lg font-semibold mt-3 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Story Image */}
      <section className="bg-green-50 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow">
          <Image
            src="/kurta2.jpg"
            alt="Our team"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Built on Passion, Grown on Trust</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            What started as a small workshop with four artisans has grown into a team of dedicated
            craftspeople, designers, and sustainability advocates. We share one goal: to make
            clothing that stands the test of time — both in quality and in ethical practice.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Join thousands of happy customers who have made Clover Clothing part of their
            everyday wardrobe.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
        <p className="text-gray-500 mb-8">
          Browse our full collection and find your next favourite piece.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/items"
            className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Shop Now
          </Link>
          <Link
            href="/help"
            className="border-2 border-black text-black hover:bg-black hover:text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
