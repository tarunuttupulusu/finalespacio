import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Lock, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import SEO from '../components/common/SEO';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogLocked, setCatalogLocked] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const mockProduct = {
    title: 'WPC Wall Panels',
    slug: 'wpc-wall-panels',
    category: 'wpc_wall_panels',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures. Built for residential and commercial environments demanding premium finishes.',
    heroImage: '/images/materials/wpc_panels.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: [
      { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
      { label: 'Core Weight', value: '1.8 kg/m' },
      { label: 'Water Resistance', value: '100% Waterproof' },
      { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      { label: 'Surface Finish', value: 'Deep Embossed Wood Grain' },
      { label: 'Warranty', value: '10 Year Manufacturer' },
    ],
    features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade', 'UV Resistant', 'Easy Maintenance'],
    colors: [
      { name: 'Natural Oak', hex: '#D2B48C' },
      { name: 'Smoked Walnut', hex: '#5C4033' },
      { name: 'Ashen Grey', hex: '#808080' },
      { name: 'Slate Charcoal', hex: '#2F4F4F' },
      { name: 'White Ash', hex: '#F5F0EB' },
    ],
    previewPages: [
      '/images/materials/wpc_panels.jpg',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', // blurred
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', // blurred
    ],
    applications: ['Modular Kitchen Cabinets', 'Living Room Feature Walls', 'Bedroom Headboards', 'Office Ceilings', 'Bathroom Panels', 'Commercial Reception'],
  };

  const mockProductsList = [
    {
      title: 'Fluted Acrylic Luxe - Irish',
      slug: 'fluted-acrylic-luxe-irish',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Irish fluted acrylic wall panel with rich relief lines and a contemporary matte off-white finish.',
      heroImage: '/images/materials/irish.png',
      gallery: ['/images/materials/irish.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
        { label: 'Surface Finish', value: 'Matte Acrylic fluted relief' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Irish Finish', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Irish Off-White', hex: '#EAE6DF' }],
      previewPages: ['/images/materials/irish.png'],
      applications: ['Modular Wardrobes', 'Living Room Accent Panels', 'Bedroom Headboards']
    },
    {
      title: 'Fluted Acrylic Luxe - Azzurro',
      slug: 'fluted-acrylic-luxe-azzurro',
      category: 'fluted_panels',
      description: 'Elegant NX-GEN 1 Azzurro fluted accent panel in a beautiful sky-blue finish, perfect for premium master bedrooms and lounges.',
      heroImage: '/images/materials/azzurro.png',
      gallery: ['/images/materials/azzurro.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Azzurro Sky Blue' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Azzurro Blue', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Azzurro Blue', hex: '#87B5C8' }],
      previewPages: ['/images/materials/azzurro.png'],
      applications: ['Master Bedroom Headboard', 'Living Room Feature Wall', 'Creative Studio Lounge']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo',
      slug: 'fluted-acrylic-luxe-giallo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo fluted panel. Professional workspace accent element with clean textured lines in a medium-gray tone.',
      heroImage: '/images/materials/giallo.png',
      gallery: ['/images/materials/giallo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Slate Gray' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Gray', '100% Waterproof', 'Flame Retardant'],
      colors: [{ name: 'Giallo Slate Gray', hex: '#8E8D8A' }],
      previewPages: ['/images/materials/giallo.png'],
      applications: ['Home Office Desks Backdrop', 'Executive Meeting Rooms', 'Reception counters']
    },
    {
      title: 'Fluted Acrylic Luxe - Marbo',
      slug: 'fluted-acrylic-luxe-marbo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Marbo panel. Curator-selected sandy-beige fluted cladding for warm light-diffused luxury dining environments.',
      heroImage: '/images/materials/marbo.png',
      gallery: ['/images/materials/marbo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Marbo Sandy Beige' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Marbo Sand', '100% Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Marbo Sand', hex: '#D2C1AE' }],
      previewPages: ['/images/materials/marbo.png'],
      applications: ['Dining Room Feature Wall', 'Kitchen backsplash partitions', 'Hotel lobby lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida',
      slug: 'fluted-acrylic-luxe-florida',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Florida fluted surface displaying high-fidelity white marble texture running with golden veins.',
      heroImage: '/images/materials/florida.png',
      gallery: ['/images/materials/florida.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Florida Golden Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Florida Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida.png'],
      applications: ['Luxury Living TV panels', 'Master Suite backdrop elevation', 'Retail luxury boutique backdrop']
    },
    {
      title: 'Fluted Acrylic Luxe - Menta',
      slug: 'fluted-acrylic-luxe-menta',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Menta fluted wall panel. Restful and organic mint green vertical textures, perfect for calming bedroom designs.',
      heroImage: '/images/materials/menta.png',
      gallery: ['/images/materials/menta.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Menta Mint Green' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Menta Green', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Menta Green', hex: '#A2C2B3' }],
      previewPages: ['/images/materials/menta.png'],
      applications: ['Bed Headboards backdrop', 'Spas & Wellness centers', 'Living room calming walls']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo Dining',
      slug: 'fluted-acrylic-luxe-giallo-dining',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo Dining panel. Modern sand-tinted vertical lines styling luxury family dining partitions and ambient layouts.',
      heroImage: '/images/materials/giallo_dining.png',
      gallery: ['/images/materials/giallo_dining.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Sand' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Sand', 'Heat Resistant', 'Termite Proof'],
      colors: [{ name: 'Giallo Sand', hex: '#D7CBBD' }],
      previewPages: ['/images/materials/giallo_dining.png'],
      applications: ['Dining Space feature panels', 'Restaurant ambient divisions', 'Luxury kitchen partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash',
      slug: 'fluted-acrylic-luxe-ash',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Ash fluted element. Clean industrial slate ash tones, offering a sophisticated background for media consoles and screens.',
      heroImage: '/images/materials/ash.png',
      gallery: ['/images/materials/ash.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray-Blue' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray-Blue', hex: '#9CAAB6' }],
      previewPages: ['/images/materials/ash.png'],
      applications: ['Living room TV Backdrop', 'Smart Entertainment Units', 'Office lounge focus wall']
    },
    {
      title: 'Fluted Acrylic Luxe - Linia',
      slug: 'fluted-acrylic-luxe-linia',
      category: 'fluted_panels',
      description: 'Luxury NX-GEN 2 Linia panel. Delicate warm marble surface patterns detailed with rich gold veins for premium bathroom vanity accenting.',
      heroImage: '/images/materials/linia.png',
      gallery: ['/images/materials/linia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Linia Gold Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Linia Gold', 'Waterproof', 'Anti-Scratch'],
      colors: [{ name: 'Linia Gold Marble', hex: '#F0ECE1' }],
      previewPages: ['/images/materials/linia.png'],
      applications: ['Luxury Bathroom basins wall', 'Premium vanity units elevation', 'Spa backdrop dividers']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida Vanity',
      slug: 'fluted-acrylic-luxe-florida-vanity',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Florida Vanity layout. Elegant vertical marble and gold trim detailing designed for high-end boutique powder rooms and dressing spaces.',
      heroImage: '/images/materials/florida_vanity.png',
      gallery: ['/images/materials/florida_vanity.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Florida Vanity Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Florida Gold Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Vanity Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida_vanity.png'],
      applications: ['Boutique Powder Room', 'Walk-in Wardrobe Dressing vanity', 'Luxury bathroom partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Gracia',
      slug: 'fluted-acrylic-luxe-gracia',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Gracia fluted wall panel. Fine off-white marble relief details with standard interlocking installation.',
      heroImage: '/images/materials/gracia.png',
      gallery: ['/images/materials/gracia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Gracia Marble White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Gracia Finish', 'Waterproof', 'Easy Install'],
      colors: [{ name: 'Gracia Marble White', hex: '#EBEAE6' }],
      previewPages: ['/images/materials/gracia.png'],
      applications: ['Living room sofa wall backdrop', 'Reception lobbies', 'Executive meeting lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Irish Gen 2',
      slug: 'fluted-acrylic-luxe-irish-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Irish fluted panel. Next-generation contemporary off-white finish styling luxury executive workspaces and desks.',
      heroImage: '/images/materials/irish_gen2.png',
      gallery: ['/images/materials/irish_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Irish Finish', 'Anti-Scratch', 'Eco E0 Grade'],
      colors: [{ name: 'Irish Off-White Gen 2', hex: '#E6E3DB' }],
      previewPages: ['/images/materials/irish_gen2.png'],
      applications: ['Executive Workstation desks backdrop', 'Study room accent elevations', 'Luxury library panels']
    },
    {
      title: 'Fluted Acrylic Luxe - Blanco',
      slug: 'fluted-acrylic-luxe-blanco',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Blanco panel. Minimalist crisp-white fluted texture, perfect for styling bunk beds and modern children\'s bedrooms.',
      heroImage: '/images/materials/blanco.png',
      gallery: ['/images/materials/blanco.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Blanco White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Blanco White', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Blanco White', hex: '#FFFFFF' }],
      previewPages: ['/images/materials/blanco.png'],
      applications: ['Kids Bed backdrop wall', 'Bunk bed structural cladding', 'Bright minimalist lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Formic',
      slug: 'fluted-acrylic-luxe-formic',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Formic panel. Warm vertical oak-grained relief lines detailing high-ceiling staircases and open spaces.',
      heroImage: '/images/materials/formic.png',
      gallery: ['/images/materials/formic.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Formic Oak' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Formic Oak', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Formic Oak', hex: '#E4D6BD' }],
      previewPages: ['/images/materials/formic.png'],
      applications: ['Staircase high-ceiling walls', 'Luxury lobby dividers', 'Bespoke divider screens']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash Gen 2',
      slug: 'fluted-acrylic-luxe-ash-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Ash panel. Light gray contemporary fluted textures, providing a premium backdrop for master suite bed elevations.',
      heroImage: '/images/materials/ash_gen2.png',
      gallery: ['/images/materials/ash_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray Gen 2', hex: '#A8B4BD' }],
      previewPages: ['/images/materials/ash_gen2.png'],
      applications: ['Master suite bed headboard wall', 'Luxury TV lounges elevations', 'Hotel rooms key-walls']
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${slug}`);
        if (response.data.success && response.data.data) {
          setProduct(response.data.data);
        } else {
          const found = mockProductsList.find(m => m.slug === slug);
          setProduct(found || mockProduct);
        }
      } catch {
        const found = mockProductsList.find(m => m.slug === slug);
        setProduct(found || mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const p = product || mockProduct;
  const previewLimit = 7;
  const allPages = p.previewPages || mockProduct.previewPages;

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <p className="font-sans text-sm text-walnut animate-pulse">Loading material details...</p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO title={`${p.title} — Material Details`} description={p.description ? p.description.substring(0, 150) : 'Material details...'} image={p.heroImage} url={`/products/${p.slug}`} />
      {/* Back */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-4">
        <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-walnut hover:text-gold font-bold transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Material Library</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative h-[60vh] bg-black mb-0">
        <img src={p.heroImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent" />
        <div className="absolute bottom-12 left-0 w-full">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-2">
            <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Premium Material</span>
            <h1 className="text-white text-4xl md:text-5xl font-editorial font-bold">{p.title}</h1>
          </div>
        </div>
      </section>

      {/* Overview + Features */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h2 className="font-editorial text-3xl font-bold text-charcoal">Material Overview</h2>
          <p className="font-sans text-sm text-walnut leading-relaxed">{p.description}</p>

          {/* Feature Tags */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Key Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {(p.features || mockProduct.features).map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-sans text-walnut">
                  <CheckCircle size={14} className="text-gold shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-6">
          <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Available Finishes</h3>
          <div className="flex flex-wrap gap-4">
            {(p.colors || mockProduct.colors).map((color, idx) => (
              <button key={idx} onClick={() => setActiveColor(idx)}
                className={`flex flex-col items-center space-y-2 group transition-all duration-200 ${activeColor === idx ? 'scale-105' : ''}`}>
                <div
                  className={`w-12 h-12 rounded-full border-2 shadow-sm transition-all ${activeColor === idx ? 'border-gold scale-110 shadow-md' : 'border-walnut/20 group-hover:border-walnut/50'}`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-sans text-[9px] text-walnut uppercase tracking-wide text-center max-w-[60px]">{color.name}</span>
              </button>
            ))}
          </div>

          {/* Specifications Table */}
          <div className="mt-6 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Technical Specifications</h3>
            <div className="border border-walnut/10 rounded-card overflow-hidden">
              {(p.specifications || mockProduct.specifications).map((spec, idx) => (
                <div key={idx} className={`flex items-center px-5 py-3.5 text-xs font-sans ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-cream'}`}>
                  <span className="text-walnut font-medium w-1/2">{spec.label}</span>
                  <span className="text-charcoal font-bold w-1/2">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Material Gallery */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <h2 className="font-editorial text-2xl font-bold mb-8">Material Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(p.gallery || mockProduct.gallery).map((img, idx) => (
            <div key={idx} onClick={() => { setLightboxIdx(idx); setLightboxOpen(true); }}
              className="rounded-card overflow-hidden aspect-square cursor-pointer group">
              <img src={img} alt={`${p.title} ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Applications */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <h2 className="font-editorial text-2xl font-bold mb-8">Applications</h2>
        <div className="flex flex-wrap gap-3">
          {(p.applications || mockProduct.applications).map((app, idx) => (
            <span key={idx} className="bg-offwhite border border-walnut/10 text-walnut font-sans text-xs px-4 py-2 rounded-full">
              {app}
            </span>
          ))}
        </div>
      </section>

      {/* ── CATALOGUE PREVIEW GATE ──────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <h2 className="font-editorial text-2xl font-bold mb-8">Product Catalogue</h2>
        <div className="relative overflow-hidden rounded-card border border-walnut/10">
          {/* Grid of pages */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {allPages.map((pageImg, idx) => {
              const isLocked = idx >= previewLimit;
              return (
                <div key={idx} className={`relative rounded-card overflow-hidden aspect-[3/4] border border-walnut/5 ${isLocked ? 'select-none' : ''}`}>
                  <img src={pageImg} alt={`Catalogue Page ${idx + 1}`} className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'blur-md scale-105' : ''}`} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-cream/50 backdrop-blur-sm flex items-center justify-center">
                      <Lock size={24} className="text-walnut/50" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center bg-cream/80 font-sans text-[9px] text-walnut uppercase tracking-widest">
                    Page {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradient overlay fade for locked pages */}
          <div className="absolute bottom-0 left-0 right-0 h-48 catalog-blur-overlay flex flex-col items-center justify-end pb-10 space-y-4">
            <div className="text-center space-y-2">
              <p className="font-sans text-sm font-bold text-charcoal">Want the Complete Catalogue?</p>
              <p className="font-sans text-xs text-walnut">Contact us to receive the full PDF with all products and specifications.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-7 rounded-button transition-transform duration-300 hover:scale-105">
              <span>Request Full Catalogue</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-charcoal/95 z-[100] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => Math.max(0, prev - 1)); }}
            className="absolute left-6 p-3 text-white hover:text-gold transition-colors">
            <ChevronLeft size={28} />
          </button>
          <img src={(p.gallery || mockProduct.gallery)[lightboxIdx]} alt="Fullscreen"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-card"
            onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => Math.min((p.gallery || mockProduct.gallery).length - 1, prev + 1)); }}
            className="absolute right-6 p-3 text-white hover:text-gold transition-colors">
            <ChevronRightIcon size={28} />
          </button>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white hover:text-gold text-2xl font-bold transition-colors">
            ✕
          </button>
          <span className="absolute bottom-6 font-sans text-xs text-cream/60 uppercase tracking-widest">
            {lightboxIdx + 1} / {(p.gallery || mockProduct.gallery).length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
