export const navLinks = [
  { to: '/what-we-do', label: 'What we do' },
  { to: '/web-design', label: 'Web design' },
  { to: '/management', label: 'Management' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/book', label: 'Book a call' },
  { to: '/quote', label: 'Get a quote' },
  { to: '/contact', label: 'Contact' },
] as const

export const slogan = "Don't just show up. Be seen everywhere!"

export const sloganWords = {
  words: ["Don't", 'just', 'show', 'up.', 'Be', 'seen'],
  accent: 'everywhere!',
}

export const services = [
  {
    slug: 'management',
    href: '/management',
    eyebrow: 'Online management',
    title: 'Your outsourced online department',
    text: 'Websites, email, hosting and day-to-day support in one plan — so you can run the business.',
  },
  {
    slug: 'web-design',
    href: '/web-design',
    eyebrow: 'Web design',
    title: 'Fast, mobile-friendly sites that look like you',
    text: 'Custom design, clear pages, and a site that is easy to update — not a dusty template.',
  },
  {
    slug: 'maintenance',
    href: '/maintenance',
    eyebrow: 'Hosting & maintenance',
    title: 'Updates, backups and someone who picks up',
    text: 'Monitoring, security patches and content tweaks in a monthly bundle.',
  },
  {
    slug: 'seo',
    href: '/what-we-do/more-than-websites',
    eyebrow: 'Visibility',
    title: 'Foundations so people can actually find you',
    text: 'Local SEO, Google Business and pages written for how customers search.',
  },
  {
    slug: 'systems',
    href: '/what-we-do/more-than-websites',
    eyebrow: 'Systems',
    title: 'Bookings, payments and the tools around the site',
    text: 'We line up the stack so email, diaries and checkout do not fight each other.',
  },
  {
    slug: 'support',
    href: '/what-we-do/support-beyond-screen',
    eyebrow: 'Support',
    title: 'Help beyond the screen',
    text: 'Advice on hardware, networks and the kit your team actually needs.',
  },
]

export const wwdPages = [
  {
    slug: 'overview',
    title: 'Focus on running your business. We will handle everything online.',
    body: 'A complete online management service for busy owners who want a professional digital presence without maintaining it themselves.',
  },
  {
    slug: 'online-department',
    title: 'Your complete online department',
    body: 'We take care of every part of your online presence — website, email, hosting, updates and the small jobs that otherwise sit on your to-do list.',
  },
  {
    slug: 'technology-without-headaches',
    title: 'Technology without the headaches',
    body: 'We make the technical decisions, set things up properly, and stay on the line when something breaks.',
  },
  {
    slug: 'more-than-websites',
    title: 'More than just websites',
    body: 'Email, cloud tools, bookings and payments — we coordinate the full stack so it works as one system.',
  },
  {
    slug: 'support-beyond-screen',
    title: 'Support beyond the screen',
    body: 'Need a laptop, a better Wi-Fi setup, or a printer that does not fight you? We help you choose and source it.',
  },
  {
    slug: 'one-partner',
    title: 'One partner. Complete peace of mind.',
    body: 'You focus on what you do best. We take care of everything online.',
  },
]

export const steps = [
  { n: '01', title: 'We listen', text: 'A short call about what you sell, who you serve, and what is already online.' },
  { n: '02', title: 'We plan', text: 'A clear scope: pages, hosting, email and what we will look after each month.' },
  { n: '03', title: 'We build', text: 'Design and development with regular check-ins — no six-month radio silence.' },
  { n: '04', title: 'We stay', text: 'Updates, backups and a named person when something needs changing.' },
]

export const reasons = [
  { title: 'Someone actually answers', text: 'Weekdays, real replies — not a ticket that vanishes into a portal.' },
  { title: 'Design and ops in one place', text: 'The people who built the site are the people who keep it running.' },
  { title: 'Built for SMEs', text: 'Clear packages for Somerset and the South West — no enterprise theatre.' },
]

export const stats = [
  { value: 120, suffix: '+', label: 'sites launched' },
  { value: 80, suffix: '+', label: 'managed plans' },
  { value: 10, suffix: '+', label: 'years online' },
  { value: 24, suffix: 'h', label: 'typical first reply' },
]

export const packages = {
  web: [
    { name: 'Starter', price: '£890', period: 'one-off', points: ['5-page site', 'Mobile-first layout', 'Contact form', 'Basic SEO'] },
    { name: 'Business', price: '£1,690', period: 'one-off', points: ['Up to 12 pages', 'CMS for edits', 'Booking or enquiry flow', 'Launch support'] },
    { name: 'Bespoke', price: 'Quote', period: 'scoped', points: ['Custom design', 'Integrations', 'E-commerce or portal', 'Project manager'] },
  ],
  management: [
    { name: 'Care', price: '£79', period: '/ month', points: ['Hosting & SSL', 'Backups', 'Email help', 'Small content edits'] },
    { name: 'Grow', price: '£149', period: '/ month', points: ['Everything in Care', 'Monthly improvements', 'Analytics review', 'Priority support'] },
    { name: 'Full desk', price: '£299', period: '/ month', points: ['Everything in Grow', 'Campaign landing pages', 'Tech advice', 'Named account lead'] },
  ],
  maintenance: [
    { name: 'Watch', price: '£39', period: '/ month', points: ['Uptime checks', 'Security patches', 'Daily backup'] },
    { name: 'Keep', price: '£69', period: '/ month', points: ['Everything in Watch', 'Plugin / dependency updates', 'Email support'] },
    { name: 'Hands-on', price: '£129', period: '/ month', points: ['Everything in Keep', 'Hours for content & fixes', 'Staging deploys'] },
  ],
}

export const partners = [
  { name: 'Harbour Lights Electrical', city: 'Minehead', field: 'Trades' },
  { name: 'Exmoor Home Care', city: 'Dulverton', field: 'Care' },
  { name: 'West Somerset Motors', city: 'Williton', field: 'Automotive' },
  { name: 'The Quay Bakery', city: 'Watchet', field: 'Hospitality' },
  { name: 'Quantock Gardens', city: 'Taunton', field: 'Landscaping' },
  { name: 'Blue Anchor Stay', city: 'Blue Anchor', field: 'Tourism' },
]

export const testimonials = [
  {
    quote: 'They asked what we actually sell before anyone opened a laptop. The site matches how we work on the tools.',
    author: 'James Hartley',
    company: 'Harbour Lights Electrical',
  },
  {
    quote: 'Delivered on the date we agreed, at the price we agreed. Tweaks afterwards landed in days, not months.',
    author: 'Priya Shah',
    company: 'Exmoor Home Care',
  },
  {
    quote: 'I am not technical. They still explained things in English, and they pick up when something breaks.',
    author: 'Tom Reed',
    company: 'West Somerset Motors',
  },
]

export const posts = [
  {
    slug: 'why-your-homepage-is-not-a-brochure',
    date: '2 September 2026',
    title: 'Your homepage is not a brochure',
    excerpt: 'If the first screen does not say who it is for and what to do next, paid ads will keep burning.',
  },
  {
    slug: 'local-search-somerset',
    date: '18 August 2026',
    title: 'Local search for Somerset trades',
    excerpt: 'Google Business, reviews and a service-area page beat another stock photo of a handshake.',
  },
  {
    slug: 'hosting-is-not-set-and-forget',
    date: '29 July 2026',
    title: 'Hosting is not set-and-forget',
    excerpt: 'Backups, certificates and updates are boring — until the Friday night they are not.',
  },
]

export const hours = [
  '09:00–10:00',
  '10:00–11:00',
  '11:00–12:00',
  '12:00–13:00',
  '13:00–14:00',
  '14:00–15:00',
  '15:00–16:00',
  '16:00–17:00',
]

export const company = {
  name: 'Takemo Ltd',
  phoneMarketing: '+44 1643 000000',
  phoneSupport: '+44 1643 000000',
  email: 'gabor.pinter@pmonline.hu',
  marketingEmail: 'hello@takemo.co.uk',
  office: 'Minehead, Somerset United Kingdom',
  hq: 'Minehead, Somerset United Kingdom',
  hours: 'weekdays 9:00–17:00',
  site: 'takemo.co.uk',
}

export const socials = [
  { label: 'Email', href: 'mailto:gabor.pinter@pmonline.hu' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]
