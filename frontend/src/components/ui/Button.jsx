import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 hover:scale-105",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 hover:scale-105",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;