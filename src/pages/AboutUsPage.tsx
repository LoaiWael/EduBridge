import { useState, useEffect } from 'react';
import { Hero3D } from '@/features/about/components/Hero3D';
import { TeamCards } from '@/features/about/components/TeamCards';
import { AboutNav } from '@/features/about/components/AboutNav';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Lightbulb, Globe2, Rocket, Users, ArrowUp } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color, align, delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
      className={`max-w-3xl ${align === 'left' ? 'mr-auto' : 'ml-auto'} bg-brand-card/60 hover:bg-brand-card/80 backdrop-blur-2xl p-10 md:p-14 rounded-brand-card shadow-brand-card border border-white/10 dark:border-white/5 pointer-events-auto transition-colors group`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className={`p-6 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500`} style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}>
          <Icon className="w-12 h-12" style={{ color }} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color }}>{title}</h2>
          <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AboutUsPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaledScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    document.title = "EduBridge - About us";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-x-hidden selection:bg-brand-primary/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-100 origin-left"
        style={{ scaleX: scaledScrollY }}
      />

      <AboutNav />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Hero3D />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full pointer-events-none mt-20">

        {/* Mission Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 drop-shadow-2xl leading-none">
                Bridging the <br className="hidden md:block" /> Gap in <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-gradient-start via-brand-pink to-brand-primary ">Education</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
              className="text-xl md:text-3xl text-brand-text-secondary leading-relaxed max-w-3xl mx-auto font-medium"
            >
              Our mission is to empower students and educators alike by providing an interactive, dynamic, and highly engaging learning environment.
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Sections */}
        <section className="container mx-auto px-6 py-32 space-y-32">
          <FeatureCard
            icon={Lightbulb}
            title="Get Inspired"
            color="var(--color-brand-pink)"
            align="left"
            delay={0.1}
            description="Explore limitless possibilities. Discover and generate groundbreaking ideas for any project you can imagine. Our platform provides the resources and community feedback necessary to evolve a simple thought into a sophisticated solution."
          />
          <FeatureCard
            icon={Globe2}
            title="Collaborate Everywhere"
            color="var(--color-brand-primary)"
            align="right"
            delay={0.1}
            description="Break down the walls of your institution. Team up and collaborate seamlessly with innovators, developers, and researchers from universities all over the globe to bring your projects to life."
          />
          <FeatureCard
            icon={Rocket}
            title="Launch & Succeed"
            color="var(--color-brand-green)"
            align="left"
            delay={0.1}
            description="Turn your collaborative ideas into real-world applications. Leverage our tools to showcase your work, gain mentorship, and connect with industry leaders who can help take your project to the next level."
          />
        </section>

        {/* Project Teams Section */}
        <section className="min-h-[80vh] py-32 flex flex-col items-center justify-center relative pointer-events-auto overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-brand-secondary/90 via-brand-secondary/40 to-transparent -z-10" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="text-center mb-16 z-20 px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-pink font-semibold mb-6 backdrop-blur-md border border-brand-pink/20">
              <Users size={16} />
              <span>EduBridge Core</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg">Behind the Project</h2>
            <p className="text-white/70 mt-6 text-xl md:text-2xl font-medium max-w-2xl mx-auto">The structural integrity and visionary minds bringing EduBridge into reality.</p>
          </motion.div>

          <TeamCards />
        </section>

      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-100 w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.button>
      )}
    </div>
  );
}

export default AboutUsPage;