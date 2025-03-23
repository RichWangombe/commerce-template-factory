
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex text-sm">
            <Link to="/" className="text-neutral-500 hover:text-neutral-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">Contact Us</span>
          </nav>

          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="mt-4 text-lg text-neutral-600">
                Get in touch with our team for any questions or inquiries
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input id="name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input id="email" type="email" required />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input id="subject" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea id="message" rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:support@example.com" className="text-neutral-600 hover:text-primary">
                        support@example.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+1234567890" className="text-neutral-600 hover:text-primary">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-neutral-600">
                        123 Main Street<br />
                        Suite 101<br />
                        Anytown, CA 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                  <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
