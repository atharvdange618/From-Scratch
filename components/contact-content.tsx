"use client";

import type React from "react";

import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "@deemlol/next-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactContent() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="mb-3 md:mb-4 font-sans text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-2xl font-serif text-base md:text-lg">
          Have a question, suggestion, or just want to say hello? I'd love to
          hear from you!
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-5 md:mb-6 font-sans text-2xl md:text-3xl font-bold">
            Contact Information
          </h2>

          <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-4 border-black bg-[#60B5FF]">
                <Mail className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Email</h3>
                <p className="font-serif text-sm md:text-base">
                  atharvdange.dev@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-4 border-black bg-[#FF9149]">
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Phone</h3>
                <p className="font-serif text-sm md:text-base">
                  +91 7875273298
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-4 border-black bg-[#AFDDFF]">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Location</h3>
                <p className="font-serif text-sm md:text-base">Pune, India</p>
              </div>
            </div>
          </div>

          <h3 className="mb-3 md:mb-4 font-bold text-sm md:text-base">
            Connect with me
          </h3>
          <div className="flex gap-2 md:gap-4">
            <Button
              asChild
              size="icon"
              className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <a
                href="https://www.instagram.com/atharvdange._"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
            <Button
              size="icon"
              className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <a
                href="https://github.com/atharvdange618"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              size="icon"
              className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <a
                href="https://www.linkedin.com/in/atharvdange"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button
              size="icon"
              className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <a href="mailto:atharvdange.dev@gmail.com">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-5 md:mb-6 font-sans text-2xl md:text-3xl font-bold">
            Send a Message
          </h2>

          {isSubmitted ? (
            <Card className="overflow-hidden rounded-none border-4 border-black bg-[#E0FFF1] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-5 md:p-6 text-center">
                <div className="mx-auto mb-3 md:mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border-4 border-black bg-[#60B5FF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 md:h-8 md:w-8"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold">
                  Message Sent!
                </h3>
                <p className="font-serif text-sm md:text-base">
                  Thank you for reaching out. I'll get back to you as soon as
                  possible.
                </p>
                <Button
                  className="mt-5 md:mt-6 rounded-none border-4 border-black bg-[#60B5FF] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="grid gap-5 md:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="font-bold">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-bold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Message"
                  rows={6}
                  className="rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none border-4 border-black bg-[#60B5FF] px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
