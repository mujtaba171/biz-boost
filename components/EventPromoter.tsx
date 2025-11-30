import React, { useState } from 'react';
import { Megaphone, Loader2, Layout, Share2, Image as ImageIcon, Users, Hash, Video, HelpCircle } from 'lucide-react';
import { EventRequest, EventResponse } from '../types';
import { generateEventContent, generateVisualFromSuggestion } from '../services/geminiService';

const EventPromoter: React.FC = () => {
  const [formData, setFormData] = useState<EventRequest>({
    eventName: '',
    eventType: 'Festival',
    dateTime: '',
    location: '',
    highlights: '',
    targetAudience: ''
  });
  const [result, setResult] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setGeneratedImageUrl(null);
    try {
      const data = await generateEventContent(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!result?.imageSuggestion) return;
    setGeneratingImage(true);
    try {
      const url = await generateVisualFromSuggestion(result.imageSuggestion);
      setGeneratedImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingImage(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center justify-center gap-2">
          <Megaphone className="w-8 h-8" />
          Event Promoter
        </h2>
        <p className="text-slate-600 mt-2">Generate buzz with targeted audience insights and interactive hooks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Event Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Winter Food Festival"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                <input
                  type="text"
                  placeholder="e.g. Concert, Sale"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Families, Teens"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input
                type="text"
                placeholder="e.g. Dec 15, 6 PM"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Downtown Park"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Highlights</label>
              <textarea
                rows={2}
                placeholder="e.g. Live music, food stalls, free entry"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
              Generate Promotion
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-500">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-2">Social Media Caption</h3>
                <p className="text-slate-800 whitespace-pre-wrap mb-4">{result.socialMediaCaption}</p>
                <div className="flex flex-wrap gap-2">
                   {result.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full font-medium flex items-center gap-0.5">
                        <Hash className="w-3 h-3"/> {tag.replace('#', '')}
                      </span>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
                    <h3 className="text-sm uppercase tracking-wide text-indigo-100 font-semibold mb-2 flex items-center gap-2">
                       <Layout className="w-4 h-4" /> Banner Text
                    </h3>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                       <p className="text-lg font-bold text-center">{result.bannerText}</p>
                    </div>
                 </div>

                 {/* Engagement Hook */}
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                     <h3 className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-2 flex items-center gap-1">
                       <HelpCircle className="w-3 h-3" /> Engagement Hooks
                     </h3>
                     <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                        {result.engagementQuestions.map((q, i) => <li key={i}>{q}</li>)}
                     </ul>
                 </div>
              </div>

              {/* Video & Image Section */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-slate-500">
                 <div className="mb-4">
                    <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-1 flex items-center gap-1">
                       <Video className="w-4 h-4" /> Video Concept
                    </h3>
                    <p className="text-sm text-slate-600 italic">"{result.videoScriptConcept}"</p>
                 </div>
                 <hr className="my-4 border-slate-100"/>
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-2 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" /> Image Idea
                </h3>
                <p className="text-slate-700 mb-4">{result.imageSuggestion}</p>
                 {generatedImageUrl ? (
                   <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                      <img src={generatedImageUrl} alt="AI Generated Event" className="w-full h-auto object-cover" />
                   </div>
                ) : (
                  <button 
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-2 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition"
                  >
                     {generatingImage ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
                     Generate poster art with AI
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
              <Megaphone className="w-12 h-12 mb-4 opacity-50" />
              <p>Ready to spread the word?</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPromoter;