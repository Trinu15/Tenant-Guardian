import React, { useState, useEffect, useRef } from 'react';
import { Upload, Home, MapPin, IndianRupee, FileText, Activity, User, Globe, Loader2, Navigation } from 'lucide-react';
import { ListingInputData } from '../types';
import { translations } from '../translations';
import { getDetailsFromCoordinates } from '../services/geminiService';

interface InputFormProps {
  onSubmit: (data: ListingInputData) => void;
  isLoading: boolean;
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
  setLanguage: (lang: 'English' | 'Hindi' | 'French' | 'Spanish') => void;
}

// Declare Leaflet global
declare global {
  interface Window {
    L: any;
  }
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, language, setLanguage }) => {
  const t = translations[language];
  const [formData, setFormData] = useState<Omit<ListingInputData, 'language' | 'photoBase64' | 'photoMimeType'>>({
    title: '',
    description: '',
    address: '',
    price: 0,
    sqft: 0,
    medianPrice: undefined,
    ownerName: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current && !mapRef.current) {
      // Default to a central location (e.g., Bangalore) or user's location
      const defaultLat = 12.9716;
      const defaultLng = 77.5946;

      const map = window.L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
      
      // Define Layers
      const streetLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const satelliteLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });

      // Add Layer Control
      const baseMaps = {
        "Streets": streetLayer,
        "Satellite": satelliteLayer
      };

      window.L.control.layers(baseMaps).addTo(map);

      // Map Click Handler
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Update Marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = window.L.marker([lat, lng]).addTo(map);
        }

        // Fetch Details
        setIsLocating(true);
        try {
          const details = await getDetailsFromCoordinates(lat, lng, language);
          setFormData(prev => ({
            ...prev,
            address: details.address || prev.address,
            ownerName: details.ownerName || prev.ownerName
          }));
        } catch (err) {
          console.error("Failed to get location details", err);
        } finally {
          setIsLocating(false);
        }
      });

      mapRef.current = map;

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
          },
          () => console.log("Geolocation permission denied")
        );
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'sqft' || name === 'medianPrice' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:image/jpeg;base64, part
        const base64Content = base64String.split(',')[1];
        setFileData({
          base64: base64Content,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      language,
      photoBase64: fileData?.base64,
      photoMimeType: fileData?.mimeType
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6" />
              {t.newAssessment}
            </h2>
            <p className="text-violet-50 mt-2">{t.uploadDetails}</p>
          </div>
          <div className="flex flex-col items-end">
             <label className="text-xs font-semibold text-white/90 mb-1 flex items-center gap-1">
               <Globe className="w-3 h-3" /> {t.language}
             </label>
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value as 'English' | 'Hindi' | 'French' | 'Spanish')}
               className="bg-white/20 border border-white/30 text-white text-sm rounded-lg focus:ring-violet-200 focus:border-white block p-2 outline-none backdrop-blur-sm"
             >
               <option value="English" className="text-gray-900">English</option>
               <option value="Hindi" className="text-gray-900">Hindi (हिंदी)</option>
               <option value="French" className="text-gray-900">French (Français)</option>
               <option value="Spanish" className="text-gray-900">Spanish (Español)</option>
             </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.listingPhoto}</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-violet-50 transition-colors">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-violet-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-violet-500">{t.clickUpload}</span> {t.dragDrop}</p>
                  <p className="text-xs text-gray-500">{t.formats}</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Home className="w-4 h-4 text-violet-500" /> {t.listingTitle}
            </label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t.placeholderTitle}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-violet-500" /> {t.address}
            </label>
            <div className="relative">
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t.placeholderAddress}
                className={`w-full p-3 border ${isLocating ? 'border-violet-400 bg-violet-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition pr-10`}
              />
              {isLocating && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="w-4 h-4 text-violet-500" /> {t.ownerName}
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder={t.placeholderOwner}
              className={`w-full p-3 border ${isLocating ? 'border-violet-400 bg-violet-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition`}
            />
          </div>

        {/* Pricing & Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-violet-500" /> {t.monthlyPrice}
            </label>
            <input
              required
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              placeholder="20000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t.sqft}</label>
            <input
              required
              type="number"
              name="sqft"
              value={formData.sqft || ''}
              onChange={handleInputChange}
              placeholder="850"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 text-nowrap">{t.medianPrice}</label>
            <input
              type="number"
              name="medianPrice"
              value={formData.medianPrice || ''}
              onChange={handleInputChange}
              placeholder="25000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <FileText className="w-4 h-4 text-violet-500" /> {t.listingDescription}
          </label>
          <textarea
            required
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t.placeholderDesc}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none"
          />
        </div>
        
        {/* MAP SECTION */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-violet-500" />
                {t.mapTitle}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{t.mapSubtitle}</p>
            </div>
            {isLocating && (
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded animate-pulse">
                {t.detectingDetails}
              </span>
            )}
          </div>
          <div ref={mapContainerRef} className="h-64 w-full z-0" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.analyzing}
            </>
          ) : (
            t.submitBtn
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;