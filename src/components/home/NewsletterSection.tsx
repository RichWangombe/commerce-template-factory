
export const NewsletterSection = () => {
  return (
    <section className="bg-neutral-900 py-16 text-white">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Stay in the loop</h2>
          <p className="mt-4 text-neutral-300">
            Subscribe to our newsletter for the latest product releases and updates.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border-0 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="button-press rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
