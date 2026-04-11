import { Link } from "react-router-dom";
import { Shield, Users, BarChart3, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full overflow-auto">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-bold text-white mb-6">Case Companion</h1>
          <p className="text-2xl text-slate-300 mb-12">
            Your comprehensive legal case management platform for organizing, tracking, and managing cases efficiently.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/login"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-lg"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-slate-400">End-to-end encryption and GDPR compliance for all your case data</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-purple-500 transition">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Team Collaboration</h3>
              <p className="text-slate-400">Work together seamlessly with real-time updates and comments</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-green-500 transition">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Analytics & Reports</h3>
              <p className="text-slate-400">Gain insights with comprehensive dashboards and reports</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-yellow-500 transition">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">24/7 Availability</h3>
              <p className="text-slate-400">Access your cases anytime, anywhere on any device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Methods Section */}
      <div className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Multiple Login Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-700 p-8 rounded-lg border border-slate-600">
              <h3 className="text-2xl font-semibold text-white mb-4">For All Users:</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Email & Password
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Phone Number OTP
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Google OAuth
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Microsoft OAuth
                </li>
              </ul>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-slate-600">
              <h3 className="text-2xl font-semibold text-white mb-4">For Organizations:</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Employee ID & PIN
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  SSO Integration
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  LDAP/Active Directory
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Two-Factor Authentication
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of legal professionals who trust Case Companion for their case management needs.
          </p>
          <Link
            to="/signup"
            className="px-10 py-4 bg-white hover:bg-slate-100 text-blue-900 rounded-lg font-semibold transition text-lg inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 px-4 bg-slate-950 border-t border-slate-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-slate-400">© 2024 Case Companion. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}

