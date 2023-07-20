// third-party
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode,
  type?: string
}

export default function AnimateButton({ children, type }: Props) {

  return (
    <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
      {children}
    </motion.div>
  );
}