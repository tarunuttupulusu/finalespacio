import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import DomeGallery from '../components/ui/DomeGallery';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const mockProducts = [
    { title: 'Fluted Acrylic Luxe - Irish', slug: 'fluted-acrylic-luxe-irish', category: 'fluted_panels', description: 'Premium NX-GEN 1 Irish fluted acrylic wall panel with rich relief lines and a contemporary matte off-white finish.', heroImage: '/images/materials/irish.png', features: ['Luxe Collection', 'NX-GEN 1', 'Irish Finish'] },
    { title: 'Fluted Acrylic Luxe - Azzurro', slug: 'fluted-acrylic-luxe-azzurro', category: 'fluted_panels', description: 'Elegant NX-GEN 1 Azzurro fluted accent panel in a beautiful sky-blue finish, perfect for premium master bedrooms and lounges.', heroImage: '/images/materials/azzurro.png', features: ['Luxe Collection', 'NX-GEN 1', 'Azzurro Blue'] },
    { title: 'Fluted Acrylic Luxe - Giallo', slug: 'fluted-acrylic-luxe-giallo', category: 'fluted_panels', description: 'NX-GEN 1 Giallo fluted panel. Professional workspace accent element with clean textured lines in a medium-gray tone.', heroImage: '/images/materials/giallo.png', features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Gray'] },
    { title: 'Fluted Acrylic Luxe - Marbo', slug: 'fluted-acrylic-luxe-marbo', category: 'fluted_panels', description: 'NX-GEN 1 Marbo panel. Curator-selected sandy-beige fluted cladding for warm light-diffused luxury dining environments.', heroImage: '/images/materials/marbo.png', features: ['Luxe Collection', 'NX-GEN 1', 'Marbo Sand'] },
    { title: 'Fluted Acrylic Luxe - Florida', slug: 'fluted-acrylic-luxe-florida', category: 'fluted_panels', description: 'Premium NX-GEN 1 Florida fluted surface displaying high-fidelity white marble texture running with golden veins.', heroImage: '/images/materials/florida.png', features: ['Luxe Collection', 'NX-GEN 1', 'Florida Marble'] },
    { title: 'Fluted Acrylic Luxe - Menta', slug: 'fluted-acrylic-luxe-menta', category: 'fluted_panels', description: 'NX-GEN 1 Menta fluted wall panel. Restful and organic mint green vertical textures, perfect for calming bedroom designs.', heroImage: '/images/materials/menta.png', features: ['Luxe Collection', 'NX-GEN 1', 'Menta Green'] },
    { title: 'Fluted Acrylic Luxe - Giallo Dining', slug: 'fluted-acrylic-luxe-giallo-dining', category: 'fluted_panels', description: 'NX-GEN 1 Giallo Dining panel. Modern sand-tinted vertical lines styling luxury family dining partitions and ambient layouts.', heroImage: '/images/materials/giallo_dining.png', features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Sand'] },
    { title: 'Fluted Acrylic Luxe - Ash', slug: 'fluted-acrylic-luxe-ash', category: 'fluted_panels', description: 'NX-GEN 1 Ash fluted element. Clean industrial slate ash tones, offering a sophisticated background for media consoles and screens.', heroImage: '/images/materials/ash.png', features: ['Luxe Collection', 'NX-GEN 1', 'Ash Blue-Gray'] },
    { title: 'Fluted Acrylic Luxe - Linia', slug: 'fluted-acrylic-luxe-linia', category: 'fluted_panels', description: 'Luxury NX-GEN 2 Linia panel. Delicate warm marble surface patterns detailed with rich gold veins for premium bathroom vanity accenting.', heroImage: '/images/materials/linia.png', features: ['Luxe Collection', 'NX-GEN 2', 'Linia Gold Marble'] },
    { title: 'Fluted Acrylic Luxe - Florida Vanity', slug: 'fluted-acrylic-luxe-florida-vanity', category: 'fluted_panels', description: 'NX-GEN 2 Florida Vanity layout. Elegant vertical marble and gold trim detailing designed for high-end boutique powder rooms and dressing spaces.', heroImage: '/images/materials/florida_vanity.png', features: ['Luxe Collection', 'NX-GEN 2', 'Florida Gold Marble'] },
    { title: 'Fluted Acrylic Luxe - Gracia', slug: 'fluted-acrylic-luxe-gracia', category: 'fluted_panels', description: 'Premium NX-GEN 2 Gracia fluted wall panel. Fine off-white marble relief details with standard interlocking installation.', heroImage: '/images/materials/gracia.png', features: ['Luxe Collection', 'NX-GEN 2', 'Gracia Finish'] },
    { title: 'Fluted Acrylic Luxe - Irish Gen 2', slug: 'fluted-acrylic-luxe-irish-gen2', category: 'fluted_panels', description: 'NX-GEN 2 Irish fluted panel. Next-generation contemporary off-white finish styling luxury executive workspaces and desks.', heroImage: '/images/materials/irish_gen2.png', features: ['Luxe Collection', 'NX-GEN 2', 'Irish Finish'] },
    { title: 'Fluted Acrylic Luxe - Blanco', slug: 'fluted-acrylic-luxe-blanco', category: 'fluted_panels', description: 'NX-GEN 2 Blanco panel. Minimalist crisp-white fluted texture, perfect for styling bunk beds and modern children\'s bedrooms.', heroImage: '/images/materials/blanco.png', features: ['Luxe Collection', 'NX-GEN 2', 'Blanco White'] },
    { title: 'Fluted Acrylic Luxe - Formic', slug: 'fluted-acrylic-luxe-formic', category: 'fluted_panels', description: 'Premium NX-GEN 2 Formic panel. Warm vertical oak-grained relief lines detailing high-ceiling staircases and open spaces.', heroImage: '/images/materials/formic.png', features: ['Luxe Collection', 'NX-GEN 2', 'Formic Oak'] },
    { title: 'Fluted Acrylic Luxe - Ash Gen 2', slug: 'fluted-acrylic-luxe-ash-gen2', category: 'fluted_panels', description: 'NX-GEN 2 Ash panel. Light gray contemporary fluted textures, providing a premium backdrop for master suite bed elevations.', heroImage: '/images/materials/ash_gen2.png', features: ['Luxe Collection', 'NX-GEN 2', 'Ash Gray'] },
    { title: 'WPC Wall Panels', slug: 'wpc-wall-panels', category: 'wpc_wall_panels', description: 'Co-extruded composite panels with rich wood grain textures. 100% waterproof, termite-proof, fire-retardant.', heroImage: '/images/materials/irish.png', features: ['Waterproof', 'Fire Retardant', 'Eco E0 Grade'] },
    { title: 'PVC Ceiling Panels', slug: 'pvc-ceiling-panels', category: 'pvc_ceiling_panels', description: 'Lightweight Class-A fire retardant ceiling elements integrating with smart lighting tracks seamlessly.', heroImage: '/images/materials/azzurro.png', features: ['Lightweight', 'Fire Class-A', 'Easy Install'] },
    { title: 'Fluted Panels', slug: 'fluted-panels', category: 'fluted_panels', description: 'Sleek architectural relief lines for master bed accent walls, home theatres, and office receptions.', heroImage: '/images/materials/gracia.png', features: ['Acoustic', 'Luxury Finish', 'Custom Widths'] },
    { title: 'Polygranite Sheets', slug: 'polygranite-sheets', category: 'polygranite_sheets', description: 'High-gloss stone surface overlays offering scratch-proof marble elevations without the weight.', heroImage: '/images/materials/florida.png', features: ['Scratch-Proof', 'Marble Finish', 'Heat Resistant'] },
    { title: 'Acrylic Sheets', slug: 'acrylic-sheets', category: 'acrylic_sheets', description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.', heroImage: '/images/materials/linia.png', features: ['Anti-Scratch', 'UV Stable', 'Mirror Gloss'] },
    { title: 'Charcoal Panels', slug: 'charcoal-panels', category: 'charcoal_panels', description: 'Richly textured wall panels infused with active charcoal for unique luxury accent wall applications.', heroImage: '/images/materials/ash.png', features: ['Air Purifying', 'Premium Texture', 'Matte Finish'] },
    { title: 'Mosaic Tiles', slug: 'mosaic-tiles', category: 'mosaic_tiles', description: 'Curated natural stone and matte metallic mosaic details for premium powder rooms and kitchen backsplashes.', heroImage: '/images/materials/florida_vanity.png', features: ['Natural Stone', 'Non-Slip', 'Handcrafted'] },
    { title: 'Decorative Louvers', slug: 'decorative-louvers', category: 'louvers', description: 'Bespoke walnut and charcoal vertical dividers engineered for light diffusion and open layout zoning.', heroImage: '/images/materials/formic.png', features: ['Light Diffusing', 'Custom Heights', 'Modular'] },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        if (response.data.success && response.data.data.length > 0) {
          setProducts(response.data.data);
        } else {
          setProducts(mockProducts);
        }
      } catch {
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sourceData = products.length > 0 ? products : mockProducts;

  const filteredProducts = searchQuery.trim()
    ? sourceData.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sourceData;

  const fallbacks = [
    '/images/materials/irish.png',
    '/images/materials/azzurro.png',
    '/images/materials/giallo.png',
    '/images/materials/marbo.png',
    '/images/materials/florida.png',
    '/images/materials/menta.png',
    '/images/materials/giallo_dining.png',
    '/images/materials/ash.png',
    '/images/materials/linia.png',
    '/images/materials/florida_vanity.png',
    '/images/materials/gracia.png',
    '/images/materials/irish_gen2.png',
    '/images/materials/blanco.png',
    '/images/materials/formic.png',
    '/images/materials/ash_gen2.png'
  ];

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO title="Premium Material Library — WPC, Fluted, Acrylic Panels" description="Explore ESPACIO's curated material library. WPC wall panels, fluted panels, polygranite, acrylic sheets, mosaic tiles and more. Request samples and catalogue." url="/products" />
      
      {/* Hero with Dome Gallery — same framed-card pattern as Home & Projects */}
      <section className="relative h-[80vh] lg:h-[95vh] px-5 pt-5 pb-[10px] lg:px-12">
        {/* Rounded dark card */}
        <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] bg-[#120F17]">
        {/* Dome Gallery Container */}
        <div className="absolute inset-0 w-full h-full z-0">
          <DomeGallery 
            images={sourceData.map((p, idx) => ({ 
              src: p.heroImage || fallbacks[idx % fallbacks.length], 
              alt: p.title 
            }))}
            fit={0.45}
            fitBasis="auto"
            overlayBlurColor="#120F17"
            grayscale={false}
            openedImageWidth="220px"
            openedImageHeight="300px"
            imageBorderRadius="12px"
            openedImageBorderRadius="18px"
          />
        </div>

        {/* Bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent pointer-events-none z-10" />

        </div>{/* end rounded card */}
      </section>

      {/* Search Bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8 flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Premium Collection</span>
          <h2 className="font-editorial text-3xl font-bold text-charcoal">Browse Materials</h2>
        </div>
        <div className="relative w-full max-w-[360px]">
          <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offwhite border border-walnut/10 hover:border-walnut/25 focus:border-gold focus:outline-none rounded-input font-sans text-xs px-12 py-3.5 text-charcoal" />
          <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-walnut" />
        </div>
      </div>

      {/* Material Cards Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map((n) => <div key={n} className="aspect-[3/4] bg-offwhite animate-pulse rounded-card" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <Link key={idx} to={`/products/${product.slug}`}
                className="group block rounded-card overflow-hidden bg-offwhite border border-walnut/5 hover:-translate-y-2 transition-all duration-400 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.heroImage || fallbacks[idx % fallbacks.length]} alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Feature badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    {(product.features || []).slice(0, 2).map((feat, fi) => (
                      <span key={fi} className="bg-cream/90 text-charcoal font-sans text-[9px] uppercase tracking-wide font-bold px-2 py-1 rounded-full">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-editorial text-lg font-bold text-charcoal group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="font-sans text-xs text-walnut leading-relaxed line-clamp-2">{product.description}</p>
                  <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-gold uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Material</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Enquiry CTA Banner */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="relative rounded-card overflow-hidden bg-charcoal py-20 px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')` }} />
          <div className="relative space-y-3">
            <h2 className="font-editorial text-3xl font-bold text-white">Need help choosing the right material?</h2>
            <p className="font-sans text-cream/70 text-sm">Our material experts will guide you to the perfect finish for your project.</p>
          </div>
          <Link to="/contact" className="relative shrink-0 inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-transform duration-300 hover:scale-105">
            <span>Book Material Consultation</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;
