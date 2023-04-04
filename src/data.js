import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Products',
      links: [
        {
          text: '🌍 GeoDB',
          href: getPermalink('/products/geodb'),
        },
        {
          text: '🛫 Mövius',
          href: getPermalink('/products/movius'),
        },
      ],
    },
    {
      text: 'Services',
      links: [
        {
          text: '🏗️ GeoData Engineering',
          href: '/services/geo-data-engineering',
        },
        {
          text: '🏋️‍♀️ Big GeoData',
          href: '/services/big-geodata-processing',
        },
        {
          text: '🧠 GeoAI & ML',
          href: '/services/geoai-ml',
        },
        {
          text: '🥞 Full Stack GeoDev',
          href: '/services/full-stack-geodev',
        }
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contact',
      href: getPermalink('/company/contact'),
    }
  ],
  actions: [
    { type: 'button', text: 'Get in touch', href: 'https://github.com/onwidget/astrowind' }
  ],
};
  
export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Movius', href: 'https://movius.com' },
        { text: 'GeoDB', href: 'https://getgeodb.com' },
        // { text: 'Team', href: '#' },
        // { text: 'Enterprise', href: '#' },
        // { text: 'Customer stories', href: '#' },
        // { text: 'Pricing', href: '#' },
        // { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '/platform/developer-api' },
        { text: 'Partners', href: '/platform/partners' },
        { text: 'Professional Services', href: '#' },
        // { text: 'Atom', href: '#' },
        // { text: 'Electron', href: '#' },
        // { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    // {
    //   title: 'Support',
    //   links: [
    //     { text: 'Docs', href: '#' },
    //     { text: 'Community Forum', href: '#' },
    //     { text: 'Professional Services', href: '#' },
    //     { text: 'Skills', href: '#' },
    //     { text: 'Status', href: '#' },
    //   ],
    // },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/company/about' },
        { text: 'Blog', href: '/blog' },
        { text: 'Careers', href: '/company/careers' },
        // { text: 'Press', href: '#' },
        // { text: 'Inclusion', href: '/company/inclusion' },
        // { text: 'Social Impact', href: '#' },
        // { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    // { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    // { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/spatial-labs-pty-ltd' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/spatial-labs' },
  ],
  footNote: `
    © Spatial Labs Pvt Ltd. All rights reserved.
  `,
};
