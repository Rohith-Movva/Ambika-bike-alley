import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      // This style adds a subtle white-to-grey fade at the top
      style={{ 
        minHeight: '100vh',
        paddingTop: '20px',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f4f7f6 300px)' 
      }}
    >
      <div className="container"> 
        {children}
      </div>
    </motion.div>
  );
};

export default PageWrapper;