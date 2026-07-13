import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import SEO from '../components/common/SEO';

// ─── Validation schema per step ───────────────────────────────────────────────
const step1Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
});

const step2Schema = z.object({
  propertyType: z.string().min(1, 'Select a property type'),
  spaceType: z.string().min(1, 'Select a space type'),
  budget: z.string().min(1, 'Select a budget range'),
  timeline: z.string().min(1, 'Select a timeline'),
});

const step3Schema = z.object({
  location: z.string().min(3, 'Location is required'),
  area: z.string().optional(),
  message: z.string().min(10, 'Please tell us more about your project'),
});

const propertyTypes = ['Apartment', 'Independent Villa', 'Luxury Flat', 'Penthouse', 'Commercial Office', 'Retail Store', 'Other'];
const spaceTypes = ['Full Home Interior', 'Modular Kitchen', 'Master Bedroom', 'Living Room', 'Dining Room', 'All Bedrooms', 'Commercial Fitout'];
const budgets = ['₹5L – ₹10L', '₹10L – ₹25L', '₹25L – ₹50L', '₹50L – ₹1Cr', '₹1Cr+', 'To be discussed'];
const timelines = ['Immediately', 'Within 1 Month', '1–3 Months', '3–6 Months', '6+ Months'];

const TOTAL_STEPS = 4;

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const schemas = [null, step1Schema, step2Schema, step3Schema];

  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [step, submitted]);

  const { register, handleSubmit, formState: { errors }, getValues, trigger, setValue, watch } = useForm({
    resolver: zodResolver(schemas[step] || z.object({})),
    defaultValues: formData,
  });

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      const values = getValues();
      setFormData((prev) => ({ ...prev, ...values }));
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinalSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    const merged = { ...formData, ...data };
    try {
      await axios.post('/leads', {
        name: `${merged.firstName} ${merged.lastName}`,
        email: merged.email,
        projectType: merged.spaceType,
        budget: merged.budget,
        message: `Property: ${merged.propertyType} | Space: ${merged.spaceType} | Budget: ${merged.budget} | Timeline: ${merged.timeline} | Location: ${merged.location} | Area: ${merged.area || 'N/A'}\n\n${merged.message}`,
      });
      setSubmitted(true);
    } catch {
      // Still show success screen for demo purposes
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center max-w-[520px] px-6 py-24 space-y-6">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-gold" />
          </div>
          <h1 className="font-editorial text-4xl font-bold text-charcoal">Thank you.</h1>
          <p className="font-sans text-sm text-walnut leading-relaxed">
            Your consultation request has been received. Our design team will reach out within <strong>24 hours</strong> to schedule your complimentary design session.
          </p>
          <div className="pt-4 space-y-3">
            <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold">What happens next?</p>
            {['Design team reviews your brief', 'You receive a personalised call', 'Site visit is scheduled', 'Concept presentation is prepared'].map((s, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs font-sans text-walnut">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px] shrink-0">{idx + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <a href="/" className="inline-flex items-center space-x-2 bg-charcoal hover:bg-gold text-cream hover:text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-all duration-300 mt-4">
            <span>Back to ESPACIO</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO title="Book a Consultation — Luxury Interior Design" description="Submit your project requirements through our multi-step quote wizard to request a private consultation with ESPACIO's principal interior design team." url="/contact" />
      {/* HERO */}
      <section className="relative h-[70vh] bg-black flex items-center">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80" alt="Contact ESPACIO" className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-charcoal/20" />
        <div className="relative max-w-[1440px] w-full mx-auto px-6 md:px-12 z-10 pt-20 space-y-5">
          <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Book Consultation</span>
          <h1 className="text-white text-5xl md:text-6xl font-editorial font-bold leading-tight max-w-[700px]">
            Let's Design <br />Something <br />Remarkable.
          </h1>
          <p className="font-sans text-cream/85 text-sm max-w-[450px] leading-relaxed">
            Tell us about your project. Our design principals take on a limited number of projects to ensure every space receives the attention it deserves.
          </p>
        </div>
      </section>

      {/* WIZARD */}
      <section ref={formRef} className="max-w-[820px] mx-auto px-6 py-20 scroll-mt-28">
        {/* Step indicator */}
        <div className="mb-14 space-y-4">
          <div className="flex items-center justify-between">
            {['Your Details', 'Project Brief', 'Project Location', 'Review'].map((label, idx) => {
              const n = idx + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className={`flex flex-col items-center space-y-2 ${idx < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? 'bg-gold text-charcoal' : active ? 'bg-charcoal text-white' : 'bg-offwhite border border-walnut/15 text-walnut'}`}>
                    {done ? <CheckCircle size={16} /> : n}
                  </div>
                  <span className={`font-sans text-[9px] uppercase tracking-widest font-bold hidden md:block ${active ? 'text-charcoal' : 'text-walnut/60'}`}>{label}</span>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-offwhite rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* STEP 1 – Personal Details */}
        {step === 1 && (
          <form id="s1" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-editorial text-3xl font-bold text-charcoal">Who are we designing for?</h2>
              <p className="font-sans text-sm text-walnut">Let's start with your details so we can personalise your experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">First Name *</label>
                <input {...register('firstName')} placeholder="Arjun" className="espacio-input" />
                {errors.firstName && <p className="font-sans text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Last Name *</label>
                <input {...register('lastName')} placeholder="Sharma" className="espacio-input" />
                {errors.lastName && <p className="font-sans text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Email Address *</label>
              <input {...register('email')} type="email" placeholder="arjun@example.com" className="espacio-input" />
              {errors.email && <p className="font-sans text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <WizardNav step={step} total={TOTAL_STEPS} onNext={handleNext} onBack={handleBack} />
          </form>
        )}

        {/* STEP 2 – Project Brief */}
        {step === 2 && (
          <form id="s2" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-editorial text-3xl font-bold text-charcoal">Tell us about your space.</h2>
              <p className="font-sans text-sm text-walnut">Help us understand what you need so we can match the right design team.</p>
            </div>

            {/* Property type grid select */}
            <div className="space-y-3">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Property Type *</label>
              <input type="hidden" {...register('propertyType')} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyTypes.map((pt) => {
                  const current = watch('propertyType');
                  const isSelected = current === pt;
                  return (
                    <button type="button" key={pt} onClick={() => setValue('propertyType', pt)}
                      className={`py-3 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${isSelected ? 'bg-gold border-gold text-charcoal' : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'}`}>
                      {pt}
                    </button>
                  );
                })}
              </div>
              {errors.propertyType && <p className="font-sans text-xs text-red-500">{errors.propertyType.message}</p>}
            </div>

            {/* Space type */}
            <div className="space-y-3">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Space Type *</label>
              <input type="hidden" {...register('spaceType')} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {spaceTypes.map((st) => {
                  const current = watch('spaceType');
                  const isSelected = current === st;
                  return (
                    <button type="button" key={st} onClick={() => setValue('spaceType', st)}
                      className={`py-3 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${isSelected ? 'bg-gold border-gold text-charcoal' : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'}`}>
                      {st}
                    </button>
                  );
                })}
              </div>
              {errors.spaceType && <p className="font-sans text-xs text-red-500">{errors.spaceType.message}</p>}
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Budget Range *</label>
              <input type="hidden" {...register('budget')} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {budgets.map((b) => {
                  const current = watch('budget');
                  return (
                    <button type="button" key={b} onClick={() => setValue('budget', b)}
                      className={`py-3 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${current === b ? 'bg-gold border-gold text-charcoal' : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'}`}>
                      {b}
                    </button>
                  );
                })}
              </div>
              {errors.budget && <p className="font-sans text-xs text-red-500">{errors.budget.message}</p>}
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Timeline *</label>
              <input type="hidden" {...register('timeline')} />
              <div className="flex flex-wrap gap-3">
                {timelines.map((t) => {
                  const current = watch('timeline');
                  return (
                    <button type="button" key={t} onClick={() => setValue('timeline', t)}
                      className={`py-3 px-5 rounded-full text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${current === t ? 'bg-charcoal border-charcoal text-cream' : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
              {errors.timeline && <p className="font-sans text-xs text-red-500">{errors.timeline.message}</p>}
            </div>

            <WizardNav step={step} total={TOTAL_STEPS} onNext={handleNext} onBack={handleBack} />
          </form>
        )}

        {/* STEP 3 – Location & Notes */}
        {step === 3 && (
          <form id="s3" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-editorial text-3xl font-bold text-charcoal">Where is your project?</h2>
              <p className="font-sans text-sm text-walnut">Share your location and any additional notes for our design team.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Location / Address *</label>
                <input {...register('location')} placeholder="Banjara Hills, Hyderabad" className="espacio-input" />
                {errors.location && <p className="font-sans text-xs text-red-500">{errors.location.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Total Area (optional)</label>
                <input {...register('area')} placeholder="e.g. 2200 sq ft" className="espacio-input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Project Notes *</label>
              <textarea {...register('message')} rows={5} placeholder="Describe your vision, style preferences, and any special requirements..."
                className="espacio-input resize-none" />
              {errors.message && <p className="font-sans text-xs text-red-500">{errors.message.message}</p>}
            </div>
            <WizardNav step={step} total={TOTAL_STEPS} onNext={handleNext} onBack={handleBack} />
          </form>
        )}

        {/* STEP 4 – Review & Submit */}
        {step === 4 && (
          <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-editorial text-3xl font-bold text-charcoal">Review your brief.</h2>
              <p className="font-sans text-sm text-walnut">Everything looks correct? Submit to connect with our design team.</p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              <ReviewSection title="Your Details" items={[
                { label: 'Name', value: `${formData.firstName || ''} ${formData.lastName || ''}` },
                { label: 'Email', value: formData.email || '' },
              ]} onEdit={() => setStep(1)} />
              <ReviewSection title="Project Brief" items={[
                { label: 'Property Type', value: formData.propertyType },
                { label: 'Space Type', value: formData.spaceType },
                { label: 'Budget', value: formData.budget },
                { label: 'Timeline', value: formData.timeline },
              ]} onEdit={() => setStep(2)} />
              <ReviewSection title="Location & Notes" items={[
                { label: 'Location', value: formData.location },
                { label: 'Area', value: formData.area || 'Not specified' },
                { label: 'Notes', value: formData.message?.substring(0, 100) + (formData.message?.length > 100 ? '...' : '') },
              ]} onEdit={() => setStep(3)} />
            </div>

            {error && <p className="font-sans text-xs text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-input">{error}</p>}

            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={handleBack} className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all">
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button type="submit" disabled={submitting}
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
                      <span>Submit Consultation Request</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                      <span>Submit Consultation Request</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                      <span>Submit Consultation Request</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const WizardNav = ({ step, total, onNext, onBack }) => {
  const label = step === total - 1 ? 'Review Brief' : 'Continue';
  return (
    <div className="flex items-center justify-between pt-4">
      {step > 1 ? (
        <button type="button" onClick={onBack} className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all">
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      ) : <div />}
      <button type="button" onClick={onNext}
        className="cursor-pointer bg-charcoal text-cream hover:bg-gold hover:text-charcoal shadow-[0px_4px_16px_rgba(16,16,20,0.15)] hover:shadow-[0px_4px_24px_rgba(201,169,110,0.3)] px-8 py-4 rounded-xl border-[1px] border-walnut/15 font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-103 group"
      >
        <div className="relative overflow-hidden h-[16px] flex items-center justify-center">
          <div className="invisible flex items-center gap-2">
            <span>{label}</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>{label}</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>{label}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </button>
    </div>
  );
};

const ReviewSection = ({ title, items, onEdit }) => (
  <div className="bg-offwhite border border-walnut/10 rounded-card p-6 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">{title}</h3>
      <button type="button" onClick={onEdit} className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold hover:underline">Edit</button>
    </div>
    {items.map((item, idx) => item.value ? (
      <div key={idx} className="flex items-start space-x-3 text-xs font-sans">
        <span className="text-walnut w-24 shrink-0">{item.label}</span>
        <span className="text-charcoal font-medium">{item.value}</span>
      </div>
    ) : null)}
  </div>
);

export default Contact;
