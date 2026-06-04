import { motion } from 'framer-motion'

export default function BentoCard({ icon: Icon, title, description, color = 'primary', size = 'normal', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative rounded-2xl glass overflow-hidden cursor-default ${
        size === 'large' ? 'lg:col-span-2 lg:row-span-2' :
        size === 'tall' ? 'lg:row-span-2' :
        size === 'wide' ? 'lg:col-span-2' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${color}/[0.02]" />
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
        <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${color}/20 transition-all duration-300`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed flex-1">{description}</p>
        <div className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-${color} to-secondary rounded-full transition-all duration-500`} />
      </div>
    </motion.div>
  )
}
