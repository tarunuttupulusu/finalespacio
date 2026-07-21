import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Check, MapPin, Phone, Mail, Clock, ShieldCheck, FileText, Sparkles, Award } from 'lucide-react';
import SEO from '../components/common/SEO';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const requirements = [
  { val: 'Turnkey Interiors', desc: 'Complete design + execution — from concept to move-in, handled entirely by us' },
  { val: 'Design Only', desc: "You need the design; you'll handle or already have execution" },
  { val: 'Renovation', desc: 'Upgrading or redesigning an existing space' },
  { val: 'Materials', desc: 'Sourcing premium panels, sheets & finishes — no design/execution needed' },
  { val: 'Something Else', desc: 'Let us understand your requirement' }
];

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    requirement: '',
    propertyType: '',
    otherPropertyType: '',
    spaces: [],
    otherSpaces: '',
    location: '',
    size: '',
    stage: '',
    notes: '',
    productCategories: [],
    quantity: '',
    fullName: '',
    mobile: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }

    const prop = params.get('property');
    const scp = params.get('scope');
    if (prop || scp) {
      const propMap = { '2bhk': 'Apartment', '3bhk': 'Apartment', 'villa': 'Villa', 'office': 'Office' };
      const scpMap = { 'full': 'Turnkey Interiors', 'kitchen': 'Turnkey Interiors', 'louvers': 'Materials' };
      setFormData(prev => ({
        ...prev,
        requirement: scpMap[scp] || 'Turnkey Interiors',
        propertyType: propMap[prop] || 'Apartment'
      }));
    }
  }, [location]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [step, submitted]);

  const isMaterials = formData.requirement === 'Materials';

  const stepsList = isMaterials 
    ? ['Requirement', 'Materials Info', 'Your Details', 'Review'] 
    : ['Requirement', 'Property Info', 'A Bit More Detail', 'Your Details', 'Review'];
  
  const activeStepIdx = isMaterials
    ? (step === 1 ? 0 : step === 3 ? 1 : step === 4 ? 2 : 3)
    : step - 1;
    
  const progressPercent = (activeStepIdx / (stepsList.length - 1)) * 100;

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.requirement) newErrors.requirement = 'Please select what you are looking for.';
    } else if (step === 2) {
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required.';
      else if (formData.propertyType === 'Others' && !formData.otherPropertyType.trim()) newErrors.propertyType = 'Please specify the property type.';

      if (!formData.spaces || formData.spaces.length === 0) newErrors.spaces = 'Please select at least one space.';
      else if (formData.spaces.includes('Others') && !formData.otherSpaces.trim()) newErrors.spaces = 'Please specify the space(s).';

      if (!formData.location || formData.location.trim().length < 3) newErrors.location = 'Project location (at least 3 characters) is required.';
    } else if (step === 3) {
      if (isMaterials) {
        if (!formData.productCategories || formData.productCategories.length === 0) {
          newErrors.productCategories = 'Please select at least one product category.';
        }
      } else {
        if (!formData.stage) newErrors.stage = 'Please select a timeline stage.';
      }
    } else if (step === 4) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1 && isMaterials) {
        setStep(3); // Skip Step 2 for Materials
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 3 && isMaterials) {
      setStep(1); // Back to Step 1 for Materials
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setError(null);

    const notes = isMaterials
      ? `Product Categories: ${formData.productCategories.join(', ')} | Approx. Quantity: ${formData.quantity || 'N/A'}`
      : `Property: ${formData.propertyType === 'Others' ? formData.otherPropertyType : formData.propertyType} | Spaces: ${formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ')} | Location: ${formData.location} | Size: ${formData.size || 'N/A'} | Stage: ${formData.stage}\n\nNotes: ${formData.notes || 'None'}`;

    const googleSheetData = {
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      requirement: formData.requirement || 'N/A',
      propertyType: formData.propertyType === 'Others' ? formData.otherPropertyType : (formData.propertyType || 'N/A'),
      spaces: formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ') || 'N/A',
      location: formData.location || 'N/A',
      size: formData.size || 'N/A',
      stage: formData.stage || 'N/A',
      materialCategories: formData.productCategories?.join(', ') || 'N/A',
      quantity: formData.quantity || 'N/A',
      notes: formData.notes || 'N/A',
      status: 'New Lead'
    };

    try {
      // 1. Send to Supabase
      if (supabase && supabase.from) {
        await supabase.from('leads').insert([
          {
            name: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            project_type: formData.requirement,
            budget: isMaterials ? 'Materials Path' : formData.stage,
            message: notes,
            status: 'new'
          }
        ]);
      }

      // 2. Send to Google Sheets Webhook if set
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googleSheetData)
          });
        } catch (e) {
          console.warn('Google Sheet webhook sync notice:', e);
        }
      }

      // 3. Send to local backend server
      try {
        await axios.post('/leads', {
          name: formData.fullName,
          email: formData.email,
          projectType: formData.requirement,
          budget: isMaterials ? 'Materials Path' : formData.stage,
          message: `Mobile: ${formData.mobile}\n\n${notes}`,
          googleSheetData
        });
      } catch (e) {
        // Continue even if local backend API fails
      }

      navigate('/contact?success=true', { replace: true });
    } catch (err) {
      console.error('Supabase submission error:', err);
      navigate('/contact?success=true', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center pt-24 text-charcoal">
        <div className="text-center max-w-[520px] px-6 py-24 space-y-6">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-gold" />
          </div>
          <h1 className="font-editorial text-4xl font-bold text-charcoal">Thank you.</h1>
          <p className="font-sans text-sm text-walnut leading-relaxed">
            Your quote request has been received. Our team will get back to you within <strong>24 hours</strong> with your personalized quote.
          </p>
          <div className="pt-4 space-y-3 flex flex-col items-center">
            <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold mb-1">What happens next?</p>
            {['We review your requirements', 'You receive your personalized quote', 'Our experts follow up with details'].map((s, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs font-sans text-walnut w-full max-w-[280px]">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px] shrink-0">{idx + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="inline-flex items-center space-x-2 bg-charcoal hover:bg-gold text-cream hover:text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-all duration-300 mt-4">
            <span>Back to ESPACIO</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO title="Get a Quote & Consultation — Luxury Interiors" description="Submit your project requirements through our multi-step quote wizard to request a private consultation with ESPACIO's principal interior design team." url="/contact" />
      
      {/* ── CLEAN PAGE TITLE HEADER ── */}
      <section className="pt-32 pb-8 px-6 text-center max-w-[820px] mx-auto">
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em]">Get A Quote & Consultation</span>
        </div>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-charcoal leading-tight">
          Let's Design Something Remarkable.
        </h1>
        <p className="font-sans text-xs md:text-sm text-walnut mt-3 max-w-[560px] mx-auto leading-relaxed">
          Submit your project details below for an itemized BOQ estimate, 3D visualization consultation, and custom material selection.
        </p>
      </section>

      {/* WIZARD SECTION */}
      <section ref={formRef} className="max-w-[820px] mx-auto px-6 pb-20 scroll-mt-28">
        
        {/* Dynamic Progress Indicator — Perfectly Aligned 5-Step Row */}
        <div className="relative mb-14 select-none">
          {/* Connecting Line behind step circles */}
          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-ink-border/50 z-0">
            <div
              className="h-full bg-gold transition-all duration-500 ease-out"
              style={{ width: `${(activeStepIdx / (stepsList.length - 1)) * 100}%` }}
            />
          </div>

          {/* 5 Equal Columns Grid */}
          <div className={`relative z-10 grid ${stepsList.length === 4 ? 'grid-cols-4' : 'grid-cols-5'} gap-2 w-full`}>
            {stepsList.map((label, idx) => {
              const done = activeStepIdx > idx;
              const active = activeStepIdx === idx;
              return (
                <div
                  key={label}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => {
                    if (done) setStep(isMaterials ? (idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 4 : 5) : idx + 1);
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                      done
                        ? 'bg-gold text-charcoal ring-4 ring-gold/20'
                        : active
                        ? 'bg-charcoal text-white ring-4 ring-charcoal/20 scale-105'
                        : 'bg-white border border-ink-border text-ink-muted'
                    }`}
                  >
                    {done ? <CheckCircle size={16} /> : idx + 1}
                  </div>
                  <span
                    className={`font-sans text-[10px] uppercase tracking-wider font-bold mt-2.5 max-w-[120px] leading-tight text-center ${
                      active ? 'text-charcoal font-extrabold' : done ? 'text-gold' : 'text-walnut/50'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WIZARD STEPS */}
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">What are you looking for?</h2>
                <p className="font-sans text-sm text-walnut">Select the option that best describes your requirement.</p>
              </div>
              
              <div className="space-y-4">
                {requirements.map((req) => {
                  const isSelected = formData.requirement === req.val;
                  return (
                    <button
                      type="button"
                      key={req.val}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, requirement: req.val }));
                        setErrors(prev => ({ ...prev, requirement: null }));
                      }}
                      className={`w-full text-left p-5 rounded-[16px] border transition-all duration-300 flex items-start justify-between group ${
                        isSelected 
                          ? 'bg-charcoal border-charcoal text-cream shadow-md' 
                          : 'bg-offwhite border-walnut/10 text-charcoal hover:border-walnut/30 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <span className={`font-sans text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-gold' : 'text-charcoal'}`}>
                          {req.val}
                        </span>
                        <p className={`font-sans text-xs ${isSelected ? 'text-cream/80' : 'text-walnut'}`}>
                          {req.desc}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                        isSelected ? 'border-gold bg-gold text-charcoal' : 'border-walnut/20'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
                {errors.requirement && (
                  <p className="font-sans text-xs text-red-500">{errors.requirement}</p>
                )}
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Tell us about the property</h2>
                <p className="font-sans text-sm text-walnut">Help us with some basic information about your project location and size.</p>
              </div>

              {/* Property Type Grid */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Property Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Office', 'Others'].map((pt) => {
                    const isSelected = formData.propertyType === pt;
                    return (
                      <button
                        type="button"
                        key={pt}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, propertyType: pt }));
                          setErrors(prev => ({ ...prev, propertyType: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {formData.propertyType === 'Others' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <input 
                        type="text" 
                        placeholder="Please specify property type..."
                        value={formData.otherPropertyType}
                        onChange={e => setFormData(p => ({ ...p, otherPropertyType: e.target.value }))}
                        className="w-full mt-1 bg-offwhite border border-walnut/10 rounded-input px-4 py-3.5 font-sans text-sm text-charcoal placeholder-walnut/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.propertyType && <p className="font-sans text-xs text-red-500">{errors.propertyType}</p>}
              </div>

              {/* Space(s) Multi-select */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Which space(s)? *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Full Home', 'Kitchen', 'Bedroom', 'Living Room', 'Office', 'Multiple Spaces', 'Others'].map((s) => {
                    const isSelected = formData.spaces.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          const updated = isSelected 
                            ? formData.spaces.filter(x => x !== s)
                            : [...formData.spaces, s];
                          setFormData(prev => ({ ...prev, spaces: updated }));
                          setErrors(prev => ({ ...prev, spaces: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? 'bg-charcoal border-charcoal text-cream' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        <span>{s}</span>
                        {isSelected && <Check size={12} className="text-gold" />}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {formData.spaces.includes('Others') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <input 
                        type="text" 
                        placeholder="Please specify which space(s)..."
                        value={formData.otherSpaces}
                        onChange={e => setFormData(p => ({ ...p, otherSpaces: e.target.value }))}
                        className="w-full mt-1 bg-offwhite border border-walnut/10 rounded-input px-4 py-3.5 font-sans text-sm text-charcoal placeholder-walnut/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.spaces && <p className="font-sans text-xs text-red-500">{errors.spaces}</p>}
              </div>

              {/* Location & Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Project Location (area/city) *</label>
                  <input 
                    value={formData.location}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, location: e.target.value }));
                      setErrors(prev => ({ ...prev, location: null }));
                    }}
                    placeholder="e.g. Jubilee Hills, Hyderabad" 
                    className="espacio-input" 
                  />
                  {errors.location && <p className="font-sans text-xs text-red-500">{errors.location}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Property Size (optional)</label>
                  <input 
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g. 3200 sq ft or 3 BHK" 
                    className="espacio-input" 
                  />
                </div>
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 3 (Non-materials) */}
          {step === 3 && !isMaterials && (
            <motion.div 
              key="step3-standard"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">A bit more detail</h2>
                <p className="font-sans text-sm text-walnut">Help us align with your timeline and specific requirements.</p>
              </div>

              {/* Stage Timeline */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">What stage are you at? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Just exploring', 'Ready to start', 'Have a timeline in mind'].map((stg) => {
                    const isSelected = formData.stage === stg;
                    return (
                      <button
                        type="button"
                        key={stg}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, stage: stg }));
                          setErrors(prev => ({ ...prev, stage: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
                {errors.stage && <p className="font-sans text-xs text-red-500">{errors.stage}</p>}
              </div>

              {/* NOTES */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Anything specific in mind? (optional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={5} 
                  placeholder="Describe your vision, style preferences, or any specific requirements..."
                  className="espacio-input resize-none" 
                />
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 3 (Materials Path) */}
          {step === 3 && isMaterials && (
            <motion.div 
              key="step3-materials"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">What are you looking for?</h2>
                <p className="font-sans text-sm text-walnut">Select the material categories you would like to source.</p>
              </div>

              {/* Product categories Multi-select */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Product Category * (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Wall & Ceiling Panels', 'Surfaces & Sheets', 'Tiles', 'Not Sure Yet'].map((cat) => {
                    const isSelected = formData.productCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          const updated = isSelected 
                            ? formData.productCategories.filter(x => x !== cat)
                            : [...formData.productCategories, cat];
                          setFormData(prev => ({ ...prev, productCategories: updated }));
                          setErrors(prev => ({ ...prev, productCategories: null }));
                        }}
                        className={`py-4 px-5 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? 'bg-charcoal border-charcoal text-cream' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check size={12} className="text-gold" />}
                      </button>
                    );
                  })}
                </div>
                {errors.productCategories && <p className="font-sans text-xs text-red-500">{errors.productCategories}</p>}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Approximate Quantity/Area (optional)</label>
                <input 
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g. 500 sq ft, 20 panels, etc." 
                  className="espacio-input" 
                />
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Your Details</h2>
                <p className="font-sans text-sm text-walnut">Enter your contact information below so we can reach out to you.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Full Name *</label>
                  <input 
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fullName: e.target.value }));
                      setErrors(prev => ({ ...prev, fullName: null }));
                    }}
                    placeholder="Arjun Sharma" 
                    className="espacio-input" 
                  />
                  {errors.fullName && <p className="font-sans text-xs text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Mobile Number *</label>
                  <input 
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, mobile: e.target.value }));
                      setErrors(prev => ({ ...prev, mobile: null }));
                    }}
                    placeholder="e.g. +91 98765 43210" 
                    className="espacio-input" 
                  />
                  {errors.mobile && <p className="font-sans text-xs text-red-500">{errors.mobile}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Email Address *</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="arjun@example.com" 
                    className="espacio-input" 
                  />
                  {errors.email && <p className="font-sans text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 5 - REVIEW */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Review your brief.</h2>
                <p className="font-sans text-sm text-walnut">Everything looks correct? Submit to connect with our design team.</p>
              </div>

              {/* 4 Category Review Cards */}
              <div className="space-y-5">
                
                {/* 1. REQUIREMENT (Step 1) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">1</span>
                      <span>Requirement</span>
                    </h3>
                    <button type="button" onClick={() => setStep(1)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Looking For</span>
                    <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.requirement || 'Not specified'}</span>
                  </div>
                </div>

                {/* 2. PROPERTY / MATERIALS INFO (Step 2 or Step 3 for Materials) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">2</span>
                      <span>{isMaterials ? 'Materials Info' : 'Property & Spaces'}</span>
                    </h3>
                    <button type="button" onClick={() => setStep(2)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="space-y-3">
                    {isMaterials ? (
                      <>
                        <div className="grid grid-cols-3">
                          <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Categories</span>
                          <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.productCategories.length > 0 ? formData.productCategories.join(', ') : 'None selected'}</span>
                        </div>
                        {formData.quantity && (
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Quantity/Area</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.quantity}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-3">
                          <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Property Type</span>
                          <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.propertyType === 'Others' ? formData.otherPropertyType : (formData.propertyType || 'Not specified')}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Spaces / Rooms</span>
                          <span className="font-sans text-sm text-charcoal font-semibold col-span-2">
                            {formData.spaces.length > 0 
                              ? formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ')
                              : 'Entire Space'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. PROJECT DETAILS (Step 3) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">3</span>
                      <span>Project Details</span>
                    </h3>
                    <button type="button" onClick={() => setStep(3)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Location</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.location || 'Not specified'}</span>
                    </div>
                    {!isMaterials && (
                      <>
                        {formData.size && (
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Size / Area</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.size}</span>
                          </div>
                        )}
                        {formData.stage && (
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Project Stage</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.stage}</span>
                          </div>
                        )}
                      </>
                    )}
                    {formData.notes && (
                      <div className="grid grid-cols-3">
                        <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Additional Notes</span>
                        <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. YOUR CONTACT DETAILS (Step 4) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">4</span>
                      <span>Your Contact Details</span>
                    </h3>
                    <button type="button" onClick={() => setStep(4)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Full Name</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.fullName || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Mobile Number</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.mobile || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Email Address</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {error && <p className="font-sans text-xs text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-input">{error}</p>}

              <div className="flex items-center justify-between pt-4">
                <button 
                  type="button" 
                  onClick={handleBack} 
                  className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="cursor-pointer bg-gold hover:bg-charcoal hover:text-cream text-charcoal px-8 py-4 rounded-xl border-[1px] border-walnut/15 shadow-[0px_4px_16px_rgba(201,169,110,0.15)] hover:shadow-[0px_4px_32px_rgba(16,16,20,0.3)] font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden h-[16px] flex items-center justify-center">
                      <div className="invisible flex items-center gap-2">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  )}
                </button>
              </div>
              
              <p className="text-center font-sans text-xs text-walnut/60 pt-2">
                We'll get back to you within 24 hours with your personalized quote.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── QUOTATION GUARANTEES & COMMITMENTS ───────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-offwhite border-t border-walnut/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-[650px] mx-auto mb-14 space-y-3">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Why Quote With ESPACIO</span>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal">Our Quotation & Execution Commitments</h2>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              We operate on absolute transparency. Every BOQ we prepare is detailed down to the millimetre and hardware specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <FileText size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Itemized BOQ Quote</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Zero surprise fees. You receive a complete line-item breakdown of hardware, board grades, and finish costs.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Clock size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">45-Day Execution</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Guaranteed on-time handover with milestone updates and dedicated project managers for your site.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">10-Year Warranty</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Direct-sourced acrylics, WPC panels, and Hettich/Hafele hardware backed by comprehensive warranties.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Sparkles size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Free 3D Render</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Visualize your living room, kitchen, and wardrobes in photorealistic 3D before starting site execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDIO & EXPERIENCE CENTER DETAILS ────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-charcoal text-cream">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center max-w-[600px] mx-auto space-y-3">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Visit Us</span>
            <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white">Experience Centers & Studio</h2>
            <p className="font-sans text-xs md:text-sm text-cream/70 leading-relaxed">
              Walk into our flagship material experience studio. Touch, feel, and compare over 200+ live panel and finish samples in person.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Experience Center */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Flagship Studio</h3>
                <p className="font-sans text-xs text-cream/80 leading-relaxed">
                  Road No. 36, Jubilee Hills,<br />
                  Near Metro Pillar 1645,<br />
                  Hyderabad, Telangana 500033
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Experience Center</span>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Direct Line</h3>
                <div className="space-y-2 font-sans text-xs text-cream/80">
                  <p className="flex items-center gap-2"><Phone size={14} className="text-gold" /> +91 98765 43210</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-gold" /> +91 91234 56789</p>
                  <p className="flex items-center gap-2 pt-2"><Mail size={14} className="text-gold" /> contact@espaciointeriors.com</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Immediate Assistance</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Studio Hours</h3>
                <div className="space-y-2 font-sans text-xs text-cream/80">
                  <p className="flex justify-between"><span>Mon – Sat:</span> <span className="font-bold text-white">10:00 AM – 7:30 PM</span></p>
                  <p className="flex justify-between"><span>Sunday:</span> <span className="text-gold font-bold">By Appointment</span></p>
                  <p className="font-sans text-[11px] text-cream/50 pt-2">Private evening consultations available upon request.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Consultation Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// ─── Internal Helper Component ───────────────────────────────────────────────
const WizardNav = ({ step, onNext, onBack }) => {
  return (
    <div className="flex items-center justify-between pt-4">
      {step > 1 ? (
        <button 
          type="button" 
          onClick={onBack} 
          className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      ) : <div />}
      <button 
        type="button" 
        onClick={onNext}
        className="cursor-pointer bg-charcoal text-cream hover:bg-gold hover:text-charcoal shadow-[0px_4px_16px_rgba(16,16,20,0.15)] hover:shadow-[0px_4px_24px_rgba(201,169,110,0.3)] px-8 py-4 rounded-xl border-[1px] border-walnut/15 font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-103 group"
      >
        <div className="relative overflow-hidden h-[16px] flex items-center justify-center">
          <div className="invisible flex items-center gap-2">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default Contact;
