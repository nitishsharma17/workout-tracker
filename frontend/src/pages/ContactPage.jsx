import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 px-4 py-2" />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 px-4 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Message</label>
            <textarea rows="5" className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 px-4 py-2" />
          </div>
          <div className="md:col-span-2">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">Send</button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;


