import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { title: "Group Chat", desc: "Stay connected with your housemates in real-time." },
  { title: "Chore Scheduling", desc: "Never forget whose turn it is to bring groceries." },
  { title: "Expense Tracking", desc: "Split bills easily and track who owes what." },
  { title: "Polls", desc: "Vote on common house decisions quickly." },
  { title: "Awards", desc: "Motivate roommates with monthly awards." },
  { title: "Calendar", desc: "Stay organized with a shared event calendar." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-6 py-16 text-center relative overflow-hidden">
      {/* 🔥 Subtle animated radial glow background */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fe285840] via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Heading */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-3xl flex flex-col gap-3"
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-primary"
          variants={fadeUp}
        >
          ShareNest
        </motion.h2>
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-white"
          variants={fadeUp}
        >
          Simplified Shared Living
        </motion.h1>

        {/* Buttons */}
        <motion.div
          className="flex gap-3 justify-center mt-4 mb-12"
          variants={fadeUp}
        >
          <Link to="/register">
            <Button size="sm" className="text-white">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" variant="outline">
              Login
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl w-full px-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            custom={index}
            className="relative group rounded-xl p-6 border border-muted/40 shadow-sm bg-gradient-to-br 
                       from-background via-background to-[#0a0a0a] overflow-hidden 
                       hover:shadow-xl hover:border-primary hover:bg-white/5 
                       transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.3deg]"
          >
            {/* Reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none opacity-10 blur-md 
                            bg-gradient-to-t from-white/10 via-white/5 to-transparent 
                            group-hover:opacity-20 transition-opacity duration-300" />

            <h3 className="text-lg font-semibold text-primary z-10 relative">
              {feature.title}
            </h3>
            <p className="text-white text-sm mt-1 tracking-wide leading-relaxed z-10 relative">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;
