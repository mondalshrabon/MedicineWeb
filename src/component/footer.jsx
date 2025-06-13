import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
const Footer = ({ Theme }) => {
  return (
    <footer className={`mt-auto ${Theme ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MediSearch</h3>
            <p className="text-sm">
              Your trusted platform for finding medicines and healthcare products quickly and reliably.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="hover:text-blue-500 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-500 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
        

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+918101561974</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>mondalshrabon6@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className={`border-t mt-8 pt-6 text-center ${Theme ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MediSearch. All rights reserved. | 
            <a href="#" className="hover:text-blue-500 ml-2">Privacy Policy</a> | 
            <a href="#" className="hover:text-blue-500 ml-2">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;