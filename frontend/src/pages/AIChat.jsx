import React, { useState } from 'react';
import axios from 'axios';

function AIChat() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'social'

  // AI Chat Assistant States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Business Advisor. Ask me anything about inventory pricing, margins, or e-commerce marketing strategy.',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Social Post Generator States
  const [socialForm, setSocialForm] = useState({
    product_name: '',
    category: '',
    price: '',
  });
  const [captionOutput, setCaptionOutput] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle AI Chat
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/ai/chat', { message: userText });
      if (res.data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else if (res.data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'AI Error: ' + JSON.stringify(res.data.error) },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error: Unable to connect to AI server. Please verify backend is running on Port 8000.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Social Post Generator
  const handleGenerateCaption = async (e) => {
    e.preventDefault();
    setSocialLoading(true);
    setCaptionOutput('');
    setCopied(false);

    try {
      const res = await axios.post('http://127.0.0.1:8000/ai/social-post', {
        product_name: socialForm.product_name,
        category: socialForm.category,
        price: parseFloat(socialForm.price),
      });

      if (res.data.caption) {
        setCaptionOutput(res.data.caption);
      } else if (res.data.error) {
        setCaptionOutput('Error: ' + JSON.stringify(res.data.error));
      }
    } catch (err) {
      setCaptionOutput('Error connecting to social post endpoint.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">AI Tools</h2>
          <p className="text-gray-400 mt-1">Intelligent advisor and social media content creator powered by Gemini</p>
        </div>
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Chat Advisor
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Instagram Caption Generator
          </button>
        </div>
      </div>

      {/* MODULE 3: AI Chat Assistant */}
      {activeTab === 'chat' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-semibold text-white text-sm">Google Gemini Business Assistant</span>
            </div>
            <span className="text-xs text-gray-500">FastAPI REST Client</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 text-gray-400 text-sm px-4 py-3 rounded-2xl animate-pulse">
                  Gemini is analyzing your question...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-gray-800 flex gap-3 bg-gray-900">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question (e.g. 'How can I discount items nearing expiry without hurting margins?')"
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* MODULE 4: Social Post Generator */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Product Information</h3>
            <p className="text-sm text-gray-400 mb-6">
              Gemini will generate high-conversion Instagram copy complete with targeted emojis and 5-7 hashtags.
            </p>
            <form onSubmit={handleGenerateCaption} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Ceramic Coffee Mug"
                  value={socialForm.product_name}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, product_name: e.target.value })
                  }
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home & Kitchen"
                  value={socialForm.category}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, category: e.target.value })
                  }
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="499.00"
                  value={socialForm.price}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, price: e.target.value })
                  }
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={socialLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
              >
                {socialLoading ? 'Drafting Caption...' : '⚡ Generate Instagram Post'}
              </button>
            </form>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Generated Post</h3>
                {captionOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(captionOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-indigo-400 px-3 py-1.5 rounded-lg border border-gray-700 transition"
                  >
                    {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                  </button>
                )}
              </div>
              {captionOutput ? (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {captionOutput}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-24 border border-dashed border-gray-800 rounded-xl text-sm">
                  {socialLoading
                    ? 'Creating your viral post...'
                    : 'Fill in the form on the left and click Generate.'}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Directly copy-paste into Instagram or schedule through your social tools.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;