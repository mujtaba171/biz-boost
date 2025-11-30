import React, { useState } from 'react';
import { Utensils, Loader2, Sparkles, Image as ImageIcon, Globe, Tag, HeartPulse, Wand2 } from 'lucide-react';
import { MenuRequest, MenuResponse } from '../types';
import { generateMenuContent, generateVisualFromSuggestion, generateSeasonalSuggestion } from '../services/geminiService';

const MenuCreator: React.FC = () => {
  const [formData, setFormData] = useState<MenuRequest>({
    ingredients: '',
    dishType: 'Main Course',
    cuisine: '',
    notes: '',
    language: 'English'
  });
  const [result, setResult] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setGeneratedImageUrl(null);
    try {
      const data = await generateMenuContent(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonalSuggest = async () => {
    setSuggesting(true);
    try {
      const suggestion = await generateSeasonalSuggestion();
      setFormData(prev => ({
        ...prev,
        ingredients: suggestion.ingredients,
        notes: `Seasonal Special: ${suggestion.description}`,
        cuisine: '', // Let AI infer or user fill
        dishType: 'Special'
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setSuggesting(false);
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
        <h2 className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-2">
          <Utensils className="w-8 h-8" />
          AI Menu Creator
        </h2>
        <p className="text-slate-600 mt-2">Craft multilingual menus with nutritional insights and promo ideas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-slate-800">Dish Details</h3>
             <button 
                type="button" 
                onClick={handleSeasonalSuggest}
                disabled={suggesting}
                className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-orange-200 transition"
             >
               {suggesting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>}
               Suggest Seasonal Dish
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dish Type</label>
                <select
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.dishType}
                  onChange={(e) => setFormData({ ...formData, dishType: e.target.value })}
                >
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Special">Special</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                 <select
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine Style</label>
              <input
                type="text"
                placeholder="e.g. Italian, Fusion, Vegan"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Ingredients</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Truffle oil, wild mushrooms, arborio rice..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Special Notes</label>
              <input
                type="text"
                placeholder="e.g. Spicy, Gluten-free"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Content
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              {/* Menu Card */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                   <h3 className="text-orange-800 font-bold uppercase tracking-wider text-xs">Menu Preview</h3>
                   {formData.language !== 'English' && <span className="text-xs bg-white px-2 py-1 rounded text-orange-600 border border-orange-200 flex gap-1 items-center"><Globe className="w-3 h-3"/> {formData.language}</span>}
                </div>
                <div className="p-6">
                  <p className="text-xl font-serif text-slate-800 italic leading-relaxed mb-4">"{result.menuDescription}"</p>
                  
                  <div className="flex gap-4 mt-4 border-t border-slate-100 pt-4">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase mb-1">
                           <HeartPulse className="w-3 h-3" /> Nutritional Info
                        </div>
                        <p className="text-sm text-slate-600">{result.nutritionalInfo}</p>
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 text-pink-600 text-xs font-bold uppercase mb-1">
                           <Tag className="w-3 h-3" /> Promo Idea
                        </div>
                        <p className="text-sm text-slate-600">{result.promotionalOffer}</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 relative overflow-hidden">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-2">Social Media Post</h3>
                <p className="text-slate-800 whitespace-pre-wrap">{result.socialMediaCaption}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-2">Visual Concept</h3>
                <p className="text-slate-700 mb-4">{result.imageSuggestion}</p>
                
                {generatedImageUrl ? (
                   <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                      <img src={generatedImageUrl} alt="AI Generated Dish" className="w-full h-auto object-cover" />
                   </div>
                ) : (
                  <button 
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center gap-2 border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-50 transition"
                  >
                     {generatingImage ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
                     Generate this image with AI
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <p>Enter dish details to generate magic!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCreator;