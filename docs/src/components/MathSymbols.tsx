import { motion } from 'framer-motion';

const symbols = [
  { symbol: '∇²ψ', x: '10%', y: '20%' },
  { symbol: '∂H/∂t', x: '85%', y: '15%' },
  { symbol: '∫∫∫', x: '5%', y: '70%' },
  { symbol: 'ℏω', x: '90%', y: '60%' },
  { symbol: 'Σ', x: '15%', y: '45%' },
  { symbol: '∞', x: '80%', y: '80%' },
  { symbol: 'λ', x: '25%', y: '85%' },
  { symbol: 'Δx·Δp', x: '70%', y: '30%' },
  { symbol: 'e^iπ', x: '92%', y: '40%' },
  { symbol: '∮', x: '8%', y: '55%' },
];

const MathSymbols = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((item, index) => (
        <motion.span
          key={index}
          className="math-symbol text-lg md:text-2xl font-mono"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5 + index * 0.5,
            repeat: Infinity,
            delay: index * 0.3,
            ease: 'easeInOut',
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default MathSymbols;
