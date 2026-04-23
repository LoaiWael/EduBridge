import { motion } from 'framer-motion';

const teamMembers = [
  { name: 'Loai Wael', role: 'Front-End Developer', img: 'https://avatars.githubusercontent.com/u/181674898?v=4', linkedin: 'https://www.linkedin.com/in/loai-wael-cs/', bg: 'var(--color-brand-primary)' },
  { name: 'Mohamed Ebrahim', role: 'Back-End Developer', img: 'https://avatars.githubusercontent.com/u/158595996?v=4', linkedin: 'https://www.linkedin.com/in/mohamedsoultann/', bg: 'var(--color-brand-primary)' },
  { name: 'Mohamed Salama', role: 'Data Scientist & AI Engineer', img: 'https://avatars.githubusercontent.com/u/159030624?v=4', linkedin: 'https://www.linkedin.com/in/mohammed-salamaa/', bg: 'var(--color-brand-gradient-start)' },
  { name: 'Louay Mohamed', role: 'Data Scientist & AI Engineer', img: 'https://avatars.githubusercontent.com/u/204197386?v=4', linkedin: 'https://www.linkedin.com/in/ACoAAEzah3sBZIj8whx1Eb0wWIpgVoVjAwCswUU?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BXLpBF63HTIqf89HiwxGAGA%3D%3D', bg: 'var(--color-brand-gradient-start)' },
  { name: 'Lamaa Diaa', role: 'UI & UX Designer', linkedin: 'https://www.linkedin.com/in/lama-diaa/', bg: 'var(--color-brand-pink)' },
];

export const TeamCards = () => {
  return (
    <div className="z-20 relative flex flex-wrap gap-8 justify-center py-10 px-4 pointer-events-auto">
      {teamMembers.map((member, i) => (
        <motion.a
          key={member.name}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
          className="w-full max-w-xs rounded-brand-card p-8 text-center flex flex-col items-center shadow-(--shadow-brand-card) border border-brand-grey/20 backdrop-blur-md"
          style={{ backgroundColor: member.bg }}
          href={member.linkedin}
          target='_blank'
        >
          <img src={member.img} className="w-24 h-24 rounded-full bg-brand-background mb-6 shadow-(--shadow-brand-card) border-3 border-white" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">{member.name}</h3>
          <p className="text-sm font-medium text-brand-text-primary">{member.role}</p>
        </motion.a>
      ))}
    </div>
  );
};
