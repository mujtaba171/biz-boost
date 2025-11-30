import React, { useState } from 'react';
import { CalendarCheck, Loader2, Send, MessageSquare, HeartHandshake, RefreshCw, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { AppointmentRequest, AppointmentResponse } from '../types';
import { generateAppointmentContent } from '../services/geminiService';

const AppointmentAssistant: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentRequest>({
    businessType: 'Salon',
    service: '',
    time: '',
    language: 'English',
    customerMessage: ''
  });
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateAppointmentContent(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error generating response.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!formData.time || !formData.service) return;
    
    const date = new Date(formData.time);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // Assume 1 hour duration
    
    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(date)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${formData.service} Appointment`,
      `DESCRIPTION:${formData.businessType} - ${formData.service}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "appointment.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-teal-600 flex items-center justify-center gap-2">
          <CalendarCheck className="w-8 h-8" />
          Booking Assistant
        </h2>
        <p className="text-slate-600 mt-2">Automate bookings, sentiment analysis, and smart upsells.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-teal-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Booking Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
              <input
                type="text"
                placeholder="e.g. Dental Clinic, Hair Salon, Tutor"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Requested</label>
              <input
                type="text"
                placeholder="e.g. Root Canal, Haircut, Math Lesson"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Arabic">Arabic</option>
                  </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                Customer Message
                <span className="text-xs font-normal text-slate-400">Optional: For sentiment analysis</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. I'm running late or I need to reschedule..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.customerMessage}
                onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Generate Response
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              {/* Sentiment & Booking */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="text-sm uppercase tracking-wide font-semibold">Booking Confirmation</h3>
                  </div>
                  {result.sentimentAnalysis && (
                     <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 font-medium flex gap-1 items-center">
                       <HeartHandshake className="w-3 h-3" /> Sentiment: {result.sentimentAnalysis}
                     </div>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-slate-800 whitespace-pre-wrap">
                  {result.bookingResponse}
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-slate-500 hover:text-green-600" onClick={() => navigator.clipboard.writeText(result.bookingResponse)}>Copy Text</button>
                  <button className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1" onClick={handleAddToCalendar}>
                     <CalendarIcon className="w-3 h-3" /> Save to Calendar
                  </button>
                </div>
              </div>

              {/* Upsell & Reschedule Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-indigo-500">
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Upsell Idea
                    </h3>
                    <p className="text-sm text-slate-700">{result.upsellSuggestion}</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-red-400">
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Reschedule Text
                    </h3>
                    <p className="text-sm text-slate-700">{result.reschedulingOption}</p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                 <div className="flex items-center gap-2 mb-2 text-yellow-600">
                  <CalendarCheck className="w-5 h-5" />
                  <h3 className="text-sm uppercase tracking-wide font-semibold">Follow-up Reminder</h3>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-slate-800 whitespace-pre-wrap">
                  {result.reminderMessage}
                </div>
                <button className="mt-2 text-xs text-slate-500 hover:text-yellow-600" onClick={() => navigator.clipboard.writeText(result.reminderMessage)}>Copy to clipboard</button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>Enter details to draft messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentAssistant;