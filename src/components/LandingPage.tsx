import React from "react";
import {
  Shield,
  MessageCircle,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                ClaimClarity
              </span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Get instant answers about your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              insurance claims
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop waiting on hold. Your AI assistant instantly tells you
            everything about your claim status, payment details, and next steps
            in plain English.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg flex items-center gap-2"
            >
              Start Your Claim Check
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-medium">Trusted by 10,000+ customers</span>
            </div>
          </div>
        </div>

        {/* Product Visual */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                ClaimClarity AI Assistant
              </span>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-gray-600 text-sm">
                  You: What's the status of my claim CLAIM-123?
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3 text-white">
                <p className="text-sm">
                  Great news! Your claim CLAIM-123 has been approved. A payment
                  of $1,500 will be deposited within 3-5 business days. Is there
                  anything else you'd like to know?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why you'll love ClaimClarity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for real people who need real answers about their insurance
            claims
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Instant Answers
            </h3>
            <p className="text-gray-600">
              Get your claim status in seconds, not hours. No more waiting on
              hold or filling out forms.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered Clarity
            </h3>
            <p className="text-gray-600">
              Complex insurance jargon translated into simple, actionable
              information you can understand.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Always Available
            </h3>
            <p className="text-gray-600">
              24/7 access to your claim information. Check anytime, anywhere,
              from any device.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What customers are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, I can understand what's happening with my claim
                without calling customer service. This saved me hours of
                frustration."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">S</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">
                    Auto Insurance Customer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The AI explained my claim status better than any human agent
                ever has. Clear, helpful, and available whenever I need it."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-green-600">M</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mike R.</p>
                  <p className="text-sm text-gray-600">
                    Health Insurance Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get clarity on your claims?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of customers who've simplified their insurance
            experience
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-lg flex items-center gap-2 mx-auto"
          >
            Start Your Free Check
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              ClaimClarity
            </span>
          </div>
          <p className="text-gray-600">
            Making insurance claims simple and transparent for everyone
          </p>
        </div>
      </footer>
    </div>
  );
}
