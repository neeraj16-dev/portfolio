import { useEffect, useRef } from 'react';

export interface SectionMetadata {
  title: string;
  description: string;
}

export interface UseSEOOptions {
  brandName?: string;
  roleTagline?: string;
  location?: string;
  activeModal?: string | null;
  customSections?: Record<string, SectionMetadata>;
  is404?: boolean;
  currentPath?: string;
}

export const DEFAULT_SECTION_METADATA: Record<string, (brand: string, role: string) => SectionMetadata> = {
  hero: (brand, role) => ({
    title: `${brand} - ${role}`,
    description: `Portfolio of ${brand}: Crafting spatial web experiences, WebGL shader typography, and high-performance digital products.`,
  }),
  about: (brand) => ({
    title: `About & Engineering Philosophy - ${brand}`,
    description: `Explore ${brand}'s technical background, creative philosophy, interactive stack workbench, and verified production deployments.`,
  }),
  works: (brand) => ({
    title: `Selected Works & Case Studies - ${brand}`,
    description: `Deep-dive architectural case studies: autonomous multi-agent engines, WebGL shader spatial studios, and hybrid RAG retrieval pipelines.`,
  }),
  contact: (brand) => ({
    title: `Contact & Collaboration - ${brand}`,
    description: `Initiate collaboration with ${brand} for full-stack systems engineering, autonomous AI pipelines, and bespoke spatial computing architectures.`,
  }),
};

export const useSEO = ({
  brandName = 'Neeraj Mayekar',
  roleTagline = 'Full Stack Developer & AI Engineer',
  location = 'Mumbai, Maharashtra, India',
  activeModal = null,
  customSections = {},
  is404 = false,
  currentPath = '/',
}: UseSEOOptions = {}) => {
  const activeSectionRef = useRef<string>('hero');

  const setMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const applyMetadata = (section: string) => {
    let title = `${brandName} - ${roleTagline}`;
    let description = `Portfolio of ${brandName}: Spatial web experiences, interactive shaders, and high-performance digital products.`;

    if (is404) {
      title = `404: Not Found | ${brandName}`;
      description = `404: The requested resource at ${currentPath} could not be resolved at this endpoint.`;
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      if (activeModal === 'roadmap') {
        title = `Architecture Roadmap - ${brandName}`;
        description = `Inspect the section-by-section roadmap and development milestones for ${brandName}'s interactive portfolio.`;
      } else if (activeModal === 'contact') {
        title = `Initiate Collaboration & Inquiries - ${brandName}`;
        description = `Direct contact and inquiries with ${brandName} for full-stack systems, WebGL shaders, and AI engineering collaborations.`;
      } else if (customSections[section]) {
        title = customSections[section].title;
        description = customSections[section].description;
      } else if (DEFAULT_SECTION_METADATA[section]) {
        const meta = DEFAULT_SECTION_METADATA[section](brandName, roleTagline);
        title = meta.title;
        description = meta.description;
      }
    }

    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', `${brandName} Portfolio`);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag(
      'meta[property="og:url"]',
      'property',
      'og:url',
      window.location.origin + window.location.pathname + (section !== 'hero' && !is404 ? `#${section}` : '')
    );
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // Geographic Meta Tags (GEO)
    setMetaTag('meta[name="geo.region"]', 'name', 'geo.region', 'IN-MH');
    setMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', location || 'Mumbai, Maharashtra, India');
    setMetaTag('meta[name="geo.position"]', 'name', 'geo.position', '19.076090;72.877426');
    setMetaTag('meta[name="ICBM"]', 'name', 'ICBM', '19.076090, 72.877426');
    setMetaTag('meta[name="geo.country"]', 'name', 'geo.country', 'IN');

    let schemaScript = document.getElementById('portfolio-schema-ld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'portfolio-schema-ld';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${window.location.origin}/#person`,
          name: brandName,
          jobTitle: roleTagline,
          description: description,
          url: window.location.origin,
          address: {
            '@type': 'PostalAddress',
            addressLocality: location?.split(',')[0]?.trim() || 'Mumbai',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 19.07609,
            longitude: 72.877426,
          },
          knowsAbout: [
            'Full Stack Development',
            'Artificial Intelligence',
            'Autonomous Agents',
            'React',
            'TypeScript',
            'Spatial Computing',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${window.location.origin}/#website`,
          url: window.location.origin,
          name: `${brandName} Interactive Portfolio`,
          description: description,
          author: {
            '@id': `${window.location.origin}/#person`,
          },
        },
      ],
    };
    schemaScript.textContent = JSON.stringify(structuredData);
  };

  useEffect(() => {
    applyMetadata(activeSectionRef.current);
  }, [activeModal, brandName, roleTagline, location, customSections, is404, currentPath]);

  useEffect(() => {
    if (is404) return;
    const sectionIds = ['hero', 'about', 'works', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topEntry = visibleEntries[0];
          if (topEntry.target.id && topEntry.target.id !== activeSectionRef.current) {
            activeSectionRef.current = topEntry.target.id;
            applyMetadata(topEntry.target.id);
          }
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -30% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [is404]);

  return { activeSection: activeSectionRef.current };
};

export default useSEO;

