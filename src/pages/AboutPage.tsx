
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

export const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex text-sm">
            <Link to="/" className="text-neutral-500 hover:text-neutral-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">About Us</span>
          </nav>

          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">About Our Company</h1>
              <p className="mt-4 text-lg text-neutral-600">
                Learn about our mission, vision, and the team behind our success
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-neutral-50">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=60"
                  alt="Our team collaborating"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="prose prose-lg mx-auto max-w-3xl">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, our company began with a simple mission: to create high-quality products that enhance people's lives. What started as a small team working out of a garage has grown into a thriving business with customers worldwide.
              </p>

              <p>
                Our journey hasn't always been easy, but our commitment to excellence and customer satisfaction has never wavered. We believe in creating products that are not only functional but also beautifully designed and ethically made.
              </p>

              <h2>Our Mission</h2>
              <p>
                We're committed to providing exceptional products that combine innovation, quality, and sustainability. Our goal is to exceed customer expectations while minimizing our environmental impact and giving back to our community.
              </p>

              <h2>Our Values</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="mb-2 text-lg font-medium">Quality</h3>
                  <p className="text-neutral-600">We never compromise on quality. Every product is thoroughly tested to ensure it meets our high standards.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="mb-2 text-lg font-medium">Innovation</h3>
                  <p className="text-neutral-600">We constantly seek new ways to improve our products and processes.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="mb-2 text-lg font-medium">Sustainability</h3>
                  <p className="text-neutral-600">We're committed to reducing our environmental impact in everything we do.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="mb-2 text-lg font-medium">Customer Focus</h3>
                  <p className="text-neutral-600">Our customers are at the heart of every decision we make.</p>
                </div>
              </div>

              <h2>Our Team</h2>
              <p>
                Our diverse team brings together expertise from various fields, united by a passion for excellence and innovation. From design and engineering to customer support and operations, every member plays a vital role in our success.
              </p>

              <h2>Get in Touch</h2>
              <p>
                We'd love to hear from you! Whether you have questions about our products, feedback on your experience, or ideas for how we can improve, your input is valuable to us.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  to="/contact"
                  className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
