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
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-6">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center max-w-2xl mt-10 sm:mt-20"
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-4 text-primary"
          variants={fadeUp}
        >
          ShareNest
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg mb-6"
          variants={fadeUp}
        >
          Simplify shared living with group chats, tasks, expenses & more.
        </motion.p>

        <motion.div className="flex gap-4 justify-center" variants={fadeUp}>
          <Link to="/register">
            <Button className="text-white">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            custom={index}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-primary">{feature.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;
