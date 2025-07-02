/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRightIcon } from "lucide-react";
import { Pointer } from "./magicui/pointer";
import { ScrollProgress } from "./magicui/scroll-progress";
import { TextAnimate } from "./magicui/text-animate";
import { motion } from "framer-motion";
import { VelocityScroll } from "./magicui/scroll-based-velocity";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { useState } from "react";

function Hero() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);
    router.push("/SignUp");
  };

  if (loading) return <Loader />;

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Scroll Progress */}
      <ScrollProgress className="fixed top-0 left-0 w-full h-[5px] bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300" />

      {/* Animated Pointer */}
      <Pointer>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-8 h-8 rounded-full"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 10px var(--accent)",
          }}
        />
      </Pointer>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Animated Title */}
            <TextAnimate
              by="text"
              animation="scaleUp"
              duration={3}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary"
            >
              MindMend
            </TextAnimate>

            {/* Animated Subtitle */}
            <TextAnimate
              by="word"
              animation="slideUp"
              duration={1}
              className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-semibold text-secondary-foreground max-w-4xl mx-auto"
            >
              Your AI Companion for a Healthier Mind.
            </TextAnimate>

            {/* CTA Button */}
            <div className="flex items-center justify-center mt-8 sm:mt-12">
              <Button
                variant="default"
                onClick={handleClick}
                className="group relative rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md transition-all duration-300 hover:bg-[var(--primary-dark)] hover:shadow-lg hover:text-[var(--secondary-foreground)]"
              >
                <div className="inline-flex items-center">
                  <span>✨ Try MindMend</span>
                  <ArrowRightIcon className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        className="bg-background min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 text-center"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl w-full">
          <TextAnimate
            as="h2"
            by="text"
            animation="fadeIn"
            duration={1.2}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary"
          >
            About MindMend
          </TextAnimate>

          <TextAnimate
            as="p"
            by="word"
            animation="slideUp"
            duration={1.5}
            delay={0.3}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-secondary-foreground leading-relaxed max-w-3xl mx-auto"
          >
            At MindMend, we believe that mental wellness should be accessible,
            personalized, and private. Our AI-powered therapist supports your
            journey to a healthier mind with intelligent conversations, guided
            reflections, and progress tracking. Your path to mental wellness
            starts here. 💙
          </TextAnimate>
        </div>
      </motion.section>

      {/* Why MindMend Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 bg-background text-center py-16 sm:py-20">
        <div className="max-w-6xl w-full">
          <TextAnimate
            as="h2"
            by="text"
            animation="fadeIn"
            duration={1.2}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary"
          >
            Why MindMend?
          </TextAnimate>

          {/* Features Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "AI-Powered Therapy",
                icon: "💡",
                desc: "Personalized mental health support.",
              },
              {
                title: "24/7 Availability",
                icon: "⏳",
                desc: "Support anytime, anywhere.",
              },
              {
                title: "Privacy Focused",
                icon: "🔒",
                desc: "End-to-end encrypted conversations.",
              },
              {
                title: "Guided Reflections",
                icon: "📖",
                desc: "Journaling & mindfulness exercises.",
              },
              {
                title: "Progress Tracking",
                icon: "📊",
                desc: "Monitor your emotional journey.",
              },
              {
                title: "No Judgment",
                icon: "🤍",
                desc: "A safe space for healing.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center p-6 sm:p-8 bg-muted rounded-xl shadow-lg"
              >
                <div className="text-3xl sm:text-4xl">{feature.icon}</div>
                <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-secondary-foreground text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Velocity Scroll */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background py-4 sm:py-12">
        <VelocityScroll
          defaultVelocity={2}
          numRows={2}
          className="text-xl sm:text-xl md:text-2xl font-semibold text-primary opacity-80 tracking-wide"
        >
          {[
            "Mindfulness.",
            "Healing.",
            "Wellness.",
            "Balance.",
            "Growth.",
            "Reflection.",
            "Resilience.",
            "Compassion.",
            "Clarity.",
          ].map((word, index) => (
            <span key={index} className="mx-4">
              {word}
            </span>
          ))}
        </VelocityScroll>

        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
      </div>

      <section className="min-h-[60vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 bg-background text-center relative w-full py-16 sm:py-20">
        <div className="max-w-4xl w-full">
          {/* Animated Heading */}
          <TextAnimate
            as="h2"
            by="text"
            animation="fadeIn"
            duration={1.2}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary"
          >
            Get Started with MindMend
          </TextAnimate>

          {/* Subheading */}
          <TextAnimate
            as="p"
            by="word"
            animation="slideUp"
            duration={1.5}
            delay={0.3}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-secondary-foreground leading-relaxed max-w-3xl mx-auto"
          >
            Begin your journey to a healthier mind today. Experience AI-powered
            support, personalized insights, and secure conversations—all in a
            judgment-free space.
          </TextAnimate>

          {/* Call to Action Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 sm:mt-12 flex justify-center"
          >
            <Button
              className="rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              onClick={handleClick}
            >
              <span className="inline-flex items-center dark:text-primary-foreground">
                Get Started Now
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10 flex justify-center items-center">
          <div className="size-[80vw] sm:size-[70vw] md:size-[60vw] lg:size-[50vw] bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
