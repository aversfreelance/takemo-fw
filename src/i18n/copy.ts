export type Locale = 'hu' | 'en'

export type Copy = {
  htmlLang: string
  title: string
  description: string
  slogan: { line1: string; line2: string; accent: string }
  kicker: string
  heroLead: string
  ctaPrimary: string
  ctaSecondary: string
  nav: { to: string; label: string }[]
  chapters: {
    id: string
    kicker: string
    title: string
    paragraphs: string[]
  }[]
  contactTitle: string
  contactLead: string
  quoteTitle: string
  quoteLead: string
  quoteToday: string
  book: string
  send: string
  name: string
  email: string
  phone: string
  message: string
  privacyCheck: string
  sent: string
  footerTag: string
  footerContact: string
  footerExplore: string
  footerAlso: string
  footerHours: string
  footerRights: string
  privacy: string
  privacyBody: string[]
  cookies: string
  cookiesMore: string[]
  accept: string
  reject: string
  customise: string
  less: string
  quoteBtn: string
  formHint: string[]
  more: string
  journey: { n: string; label: string; text: string }[]
  channels: string[]
  helpCards: { title: string; text: string; href: string }[]
  workSteps: { n: string; title: string; text: string }[]
  payNow: string
  payLater: string
  payNowNote: string
  payLaterNote: string
  payLine: string
  helpLine: string
  journeyLine: string
  workTitle: string
  punchLeft: string
  punchRight: string
  punchNote: string
}

export const copies: Record<Locale, Copy> = {
  hu: {
    htmlLang: 'hu',
    title: 'Takemo — Ne csak megjelenj! Légy látható mindenhol!',
    description:
      'Ne csak megjelenj! Légy látható mindenhol! Honlap, kapcsolat, foglalás és webshop — úgy, hogy Önnek nem kell értenie a technikához.',
    slogan: {
      line1: 'Ne csak megjelenj!',
      line2: 'Légy látható mindenhol!',
      accent: 'mindenhol!',
    },
    kicker: 'takemo.co.uk · Minehead és Budapest',
    heroLead: 'Egyszerű honlaptól a komplex üzleti megoldásokig\nkis- és középvállalkozásoknak',
    ctaPrimary: 'Üzenet',
    ctaSecondary: 'Miben segítünk',
    nav: [
      { to: '/websites', label: 'Weboldal készítés' },
      { to: '/maintenance', label: 'Karbantartás' },
      { to: '/modules', label: 'Modulok' },
      { to: '/start', label: 'Üzenet' },
      { to: '/contact', label: 'Kapcsolat' },
    ],
    chapters: [
      {
        id: 'today',
        kicker: '01',
        title: 'Ma már egy honlap önmagában nem elég',
        paragraphs: [
          'Ma már szinte minden kis- és középvállalkozásnak szüksége van saját honlapra. Az ügyfelek egyre több dolgot intéznek úgy, hogy közben nem találkoznak személyesen a vállalkozással: információt keresnek, üzenetet írnak, rendelnek, időpontot foglalnak, fizetnek vagy éppen egy kiszállítást követnek nyomon. Ez ma már nem különlegesség, hanem a 21. századi üzleti élet egyik alapja. A technika folyamatosan fejlődik, és vele együtt az is, ahogyan kommunikálunk egymással. Ennek a fejlődésnek a része az automatizálás és a mesterséges intelligencia is.',
          'Egy jó honlap ma még mindig az online jelenlét alapja. Bemutatja a vállalkozást, a szolgáltatásokat vagy a termékeket, és segít abban, hogy az ügyfél gyorsan megtalálja, amit keres. Az e-mail továbbra is fontos az üzleti kommunikációban, ajánlatoknál, számlázásnál vagy más hivatalos ügyekben.\nA hétköznapi kommunikáció azonban ennél már sokkal gyorsabb. Ma már természetes, hogy az emberek **Messengeren, WhatsAppon vagy iMessage-en** írnak egymásnak. Az újabb generációk pedig már úgy nőnek fel, hogy egyszerre sok információt dolgoznak fel, és egyre inkább képeket, videókat és rövid, gyorsan fogyasztható tartalmakat keresnek.',
          'Ezért lett ennyire fontos a **Facebook, az Instagram, a TikTok és a YouTube**. Egy vállalkozásnak ezért ma már nem elég, ha egyszerűen van egy honlapja. Arra is fel kell készülnie, hogy több különböző digitális csatornán keresztül tudjon kapcsolatot tartani az ügyfeleivel.',
        ],
      },
      {
        id: 'help',
        kicker: '02',
        title: 'Mi ebben segítünk',
        paragraphs: [
          'Mi nem egyszerűen honlapot készítünk. Abban segítünk, hogy vállalkozása belépjen egy modernebb, gyorsabb és jobban működő digitális világba, és később is lépést tudjon tartani a változásokkal.',
          'Ha Önnek csak egy egyszerű bemutatkozó oldalra van szüksége, elkészítjük. Ha olyan honlap kell, ahol az ügyfelek kapcsolatba tudnak lépni Önnel, időpontot tudnak foglalni vagy online tudnak fizetni, azt is megoldjuk. Ha webshopot szeretne, kialakíthatjuk az online fizetést, a számlázást és akár a kiszállítás követését is. Ha pedig komolyabb tartalommegosztó oldalra vagy hírportálra van szüksége, olyan rendszert is készítünk, ahol Ön vagy munkatársai egyszerűen fel tudják tölteni és szerkeszteni a tartalmakat, képeket, híreket vagy más információkat. Igény szerint a rendszer összeköthető **Facebookkal, Instagrammal vagy más online platformokkal** is.',
          'A technikai háttér miatt sem kell aggódnia. Elintézzük a **domain regisztrációját**, beállítjuk a **tárhelyet**, az **adatbázist**, és gondoskodunk arról is, hogy az oldal technikailag megfelelően működjön. Az elkészült rendszert felkészítjük arra is, hogy a Google és más keresők minél könnyebben megtalálják. Ezt nevezzük keresőoptimalizálásnak, vagy röviden **SEO-nak**.',
        ],
      },
      {
        id: 'modules',
        kicker: '03',
        title: 'Nem kell mindent egyszerre megrendelni',
        paragraphs: [
          'Szolgáltatásaink külön-külön, modulokban is kérhetők. Ha Önnek csak egy egyszerű honlapra van szüksége, nem kell fizetnie olyan funkciókért, amelyeket nem használ. Ha később szeretne hozzáadni például online foglalást, fizetést, webshopot vagy más funkciót, a rendszer bővíthető.',
          'Az áraink átláthatók. **Minden szolgáltatás annyiba kerül, amennyiért a honlapunkon kínáljuk.** A munka megkezdésekor, a szerződéskötéskor a teljes előre megbeszélt díj **20%-át** kérjük. Ez fedezi a fejlesztés induló technikai költségeit, például a domain regisztrációját, a tárhelyet, az adatbázist és a szükséges technikai szolgáltatásokat. A fennmaradó összeget akkor számlázzuk, amikor az elkészült rendszert átadjuk és üzembe helyezzük.',
          'Természetesen egy fejlesztés közben is változhatnak az igények. Ha menet közben kiderül, hogy valamire még szükség van, egy új funkció hozzáadható, vagy egy korábban tervezett megoldás módosítható.',
        ],
      },
      {
        id: 'easy',
        kicker: '04',
        title: 'Nem kell értenie a technikához',
        paragraphs: [
          'Ügyfeleink nagy része nem ért a weboldalak, szerverek, adatbázisok vagy más technikai rendszerek működéséhez. **És ezt nem is várjuk el.** Önnek nem kell tudnia, hogyan működik egy honlap a háttérben. Nem kell tudnia, mi az a szerver, adatbázis vagy keresőoptimalizálás. Ez a mi dolgunk.',
          'Azért vagyunk, hogy levegyük Önről ezt a terhet, és egy kész, működő rendszert adjunk át, amelyet Ön egyszerűen használni tud. Ha kérdése van keressen meg minket, örömmel segítünk! Ne felejtse: Nem kell értenie hozzá, ezért vagyunk mi.',
        ],
      },
    ],
    contactTitle: 'Kapcsolat',
    contactLead: 'Írjon, hívjon, vagy jöjjön el. Ahogy Önnek kényelmes.',
    quoteTitle: 'Ajánlatkérés',
    quoteLead: 'Pár mondat elég. Határidő vagy keret segíti, hogy elsőre hasznosat tudjunk mondani.',
    quoteToday: 'Ha kérdése van, írjon!',
    book: 'Időpont',
    send: 'Küldés',
    name: 'Név',
    email: 'E-mail',
    phone: 'Telefon',
    message: 'Üzenet',
    privacyCheck: 'Elfogadom az adatkezelési tájékoztatót.',
    sent: 'Megkaptuk. Hamarosan jelentkezünk.',
    footerTag: 'Minehead UK',
    footerContact: 'Kapcsolat',
    footerExplore: 'Oldalak',
    footerAlso: 'Budapest, Magyarország',
    footerHours: 'Hétköznap 9:00–17:00',
    footerRights: 'Minden jog fenntartva',
    privacy: 'Adatkezelés',
    privacyBody: [
      'A megadott elérhetőségeket csak az ajánlat, az időpont és az ügyfélszolgálat miatt használjuk. Listát nem adunk el.',
      'Az adatokat a kapcsolat lezárása után 24 hónapig őrizzük, vagy addig, amíg törlést nem kér.',
    ],
    cookies: 'Sütiket használunk a működéshez, a forgalom méréséhez és a választásai megjegyzéséhez. Részletek az adatkezelésben.',
    cookiesMore: [
      'Szükséges — űrlap és munkamenet.',
      'Funkcionális — megjegyzi a nyelvet és a választást.',
      'Statisztika — névtelen forgalom.',
      'Marketing — csak ha engedélyezi.',
    ],
    accept: 'Mind elfogad',
    reject: 'Elutasít',
    customise: 'Módosítás',
    less: 'Kevesebb',
    quoteBtn: 'Üzenet',
    formHint: [
      'Van már honlapja, domainje vagy e-mailje?',
      'Honlap, foglalás, webshop vagy valami más kell?',
      'Van határidő?',
    ],
    more: 'Tovább',
    journey: [
      {
        n: '01',
        label: 'Üzenet',
        text: 'Megírja nekünk, hogy milyen weblapot vagy online megoldást szeretne és mi válaszban elküldjük, hogy milyen határidővel tudjuk vállalni.',
      },
      {
        n: '02',
        label: 'Adatfelvétel',
        text: 'Megírja nekünk az adatokat, azt, hogy mit szeretne látni az oldalon',
      },
      {
        n: '03',
        label: 'Modulok',
        text: 'Kiválasztja, hogy milyen extrákat szeretne az oldalon',
      },
      {
        n: '04',
        label: 'Áttekintés',
        text: 'Véglegesítjük az oldal formáját',
      },
      { n: '05', label: 'Megrendelés', text: '' },
    ],
    channels: ['Messenger', 'WhatsApp', 'iMessage', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'E-mail', 'Honlap'],
    helpCards: [
      { title: 'Egyszerű bemutatkozó oldal üzenetküldéssel', text: 'Ha csak ennyi kell, ennyit csinálunk.', href: '/websites#simple' },
      { title: 'Komplex weboldal időpontfoglalással, online fizetéssel', text: 'Az ügyfél elintézi, nem kell telefonálnia.', href: '/websites#booking' },
      { title: 'Webshop számlázással', text: 'Fizetés, számla.', href: '/websites#shop' },
      { title: 'Médiamegosztó vagy hírportál felhasználómodullal', text: 'Ön tölti fel. Nem kell hozzánk írnia egy-egy cikkhez.', href: '/websites#media' },
      { title: 'Extra modulok', text: 'A háttér. Mi beállítjuk.', href: '/modules' },
      { title: 'Konfigurálás, optimalizálás, AdSense, SEO', text: 'Hogy a Google is megtalálja, nem csak az, aki már ismeri.', href: '/modules#setup' },
    ],
    workSteps: [
      { n: '01', title: 'Meghallgatjuk', text: 'Mit csinál, kinek, és mi van már online.' },
      { n: '02', title: 'Összerakjuk', text: 'Csak azt, amire most szükség van. A többi később jöhet.' },
      { n: '03', title: 'Felépítjük', text: 'Látja menet közben. Nincs hónapokig tartó csend.' },
      { n: '04', title: 'Ott maradunk', text: 'Ha valami elromlik vagy bővíteni kell, van kihez szólni.' },
    ],
    payNow: '20%',
    payLater: '80%',
    payNowNote: 'Szerződéskor. Domain, tárhely, a munka elindul.',
    payLaterNote: 'Amikor átadjuk, és használható.',
    payLine: 'NEM KELL EGYBEN KIFIZETNIE',
    helpLine: 'TÖBB MEGOLDÁS KÖZÜL IS VÁLASZTHAT',
    journeyLine: 'AZ EGÉSZ FOLYAMATOT KÖVETHETI',
    workTitle: 'Hogyan dolgozunk',
    punchLeft: 'Egy honlap',
    punchRight: 'Online jelenlét',
    punchNote: 'Ma már ez a kettő nem ugyanaz.',
  },
  en: {
    htmlLang: 'en-GB',
    title: "Takemo — Don't just show up. Be seen everywhere!",
    description:
      "Don't just show up. Be seen everywhere! A website, a way to stay in touch, booking and a shop — without you having to understand the technical side.",
    slogan: {
      line1: "Don't just show up.",
      line2: 'Be seen everywhere!',
      accent: 'everywhere!',
    },
    kicker: 'takemo.co.uk · Minehead and Budapest',
    heroLead: 'From a simple website to full online solutions\nfor small and medium-sized businesses',
    ctaPrimary: 'Message',
    ctaSecondary: 'What we do',
    nav: [
      { to: '/websites', label: 'Website design' },
      { to: '/maintenance', label: 'Monthly care' },
      { to: '/modules', label: 'Modules' },
      { to: '/start', label: 'Message' },
      { to: '/contact', label: 'Contact' },
    ],
    chapters: [
      {
        id: 'today',
        kicker: '01',
        title: 'Today, a website alone is no longer enough',
        paragraphs: [
          'Today, almost every small and medium-sized business needs its own website. Customers increasingly do things without ever meeting the business in person: they look for information, send messages, place orders, book appointments, make payments, or track deliveries online. This is no longer unusual; it is simply part of doing business in the 21st century. Technology is constantly evolving, and the way we communicate is changing with it. Automation and artificial intelligence are also part of this development.',
          'A good website is still the foundation of an online presence. It introduces your business, services, or products and helps customers quickly find the information they need. Email also remains important for business communication, quotations, invoices, and more formal matters.\nEveryday communication, however, has become much faster. Today, it is completely normal for people to communicate through **Messenger, WhatsApp, or iMessage**. Younger generations are also growing up in a digital world where they process more information and increasingly prefer images, videos, and short, easy-to-consume content.',
          'This is one of the reasons why **Facebook, Instagram, TikTok, and YouTube** have become so important. For a modern business, simply having a website is often no longer enough. Businesses also need to be ready to communicate with customers through several different digital channels.',
        ],
      },
      {
        id: 'help',
        kicker: '02',
        title: 'This is where we can help',
        paragraphs: [
          'We do not simply build websites. We help businesses move towards a more modern, faster, and more effective way of communicating online, while making sure that their digital system can grow and develop in the future.',
          'If you only need a simple website to introduce your business, we can build it. If you need a website where customers can contact you, book appointments, or make online payments, we can build that too. If you need an online shop, we can include online payments, invoicing, and even delivery tracking. And if you need a more advanced content platform or online news website, we can build a system where you or your staff can easily upload and edit articles, images, news, and other content. If required, the system can also be connected to **Facebook, Instagram, and other online platforms**.',
          'You do not need to worry about the technical side either. We can arrange your **domain registration**, configure your **hosting**, set up your **database**, and make sure the technical side of the website works properly. We can also prepare the website so that Google and other search engines can find and understand it more easily. This is called **Search Engine Optimisation, or SEO**.',
        ],
      },
      {
        id: 'modules',
        kicker: '03',
        title: 'You do not have to order everything at once',
        paragraphs: [
          'Our services can also be ordered as individual modules. If you only need a simple website, you do not need to pay for features that you will never use. If, later on, you want to add online booking, payments, an online shop, or another feature, the system can be expanded.',
          'Our pricing is transparent. **The price shown on our website is the price we charge.** When the contract is agreed and development begins, we ask for only **20% of the agreed total price**. This covers the initial technical costs of the project, such as domain registration, hosting, database services, and other technical requirements. The remaining amount is invoiced when the completed system is delivered and ready for use.',
          'Of course, requirements can change during development. If you decide that you need an additional feature, it can be added. If something needs to be changed, we can discuss it and adjust the project accordingly.',
        ],
      },
      {
        id: 'easy',
        kicker: '04',
        title: 'You do not need to understand the technology',
        paragraphs: [
          'Most of our customers are not experts in websites, servers, databases, or other technical systems — **and we do not expect them to be.** You do not need to understand what happens behind the scenes. You do not need to know how a server, a database, or search engine optimisation works. That is our job.',
          'We are here to take that technical responsibility off your shoulders and provide you with a complete, working solution that you can simply use. If you have a question, get in touch — we are always happy to help. Remember: you do not need to understand the technology. That is exactly why we are here.',
        ],
      },
    ],
    contactTitle: 'Contact',
    contactLead: 'Write, call, or visit. Whichever is easiest.',
    quoteTitle: 'Get a quote',
    quoteLead: 'A few sentences are enough. A deadline or budget helps us reply with something useful.',
    quoteToday: 'If you have a question, write to us!',
    book: 'Book a call',
    send: 'Send',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    privacyCheck: 'I agree to the privacy notice.',
    sent: 'Received. We will get back to you shortly.',
    footerTag: 'Minehead UK',
    footerContact: 'Contact',
    footerExplore: 'Pages',
    footerAlso: 'Budapest, Hungary',
    footerHours: 'Weekdays 9:00–17:00',
    footerRights: 'All rights reserved',
    privacy: 'Privacy',
    privacyBody: [
      'We only use the details you send for quotes, bookings and support. We do not sell lists.',
      'We keep the data for 24 months after the last contact, or until you ask us to delete it.',
    ],
    cookies: 'We use cookies to run the site, measure traffic and remember your choices. Details are in the privacy notice.',
    cookiesMore: [
      'Essential — forms and session.',
      'Functional — remembers language and choices.',
      'Analytics — anonymous traffic.',
      'Marketing — only if you allow it.',
    ],
    accept: 'Accept all',
    reject: 'Reject',
    customise: 'Customise',
    less: 'Less',
    quoteBtn: 'Message',
    formHint: [
      'Do you already have a website, domain or email?',
      'Is this a site, booking, a shop, or something else?',
      'Is there a deadline?',
    ],
    more: 'See more',
    journey: [
      {
        n: '01',
        label: 'Message',
        text: 'You tell us what kind of website or online solution you want, and we reply with the deadline we can take on.',
      },
      {
        n: '02',
        label: 'Your details',
        text: 'You send us the details, and what you want to see on the site.',
      },
      {
        n: '03',
        label: 'Modules',
        text: 'You choose what extras you want on the site.',
      },
      {
        n: '04',
        label: 'Overview',
        text: 'We finalise the shape of the site.',
      },
      { n: '05', label: 'Order', text: '' },
    ],
    channels: ['Messenger', 'WhatsApp', 'iMessage', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Email', 'Website'],
    helpCards: [
      { title: 'A simple introduction site with messaging', text: 'If that is all you need, that is all we build.', href: '/websites#simple' },
      { title: 'A full website with booking and online payment', text: 'The customer sorts it — no phone tag.', href: '/websites#booking' },
      { title: 'A shop with invoicing', text: 'Pay and invoice.', href: '/websites#shop' },
      { title: 'A media or news site with user accounts', text: 'You upload it. No email to us for every article.', href: '/websites#media' },
      { title: 'Extra modules', text: 'The background. We set it up.', href: '/modules' },
      { title: 'Setup, optimisation, AdSense, SEO', text: 'So Google can find you, not only people who already know you.', href: '/modules#setup' },
    ],
    workSteps: [
      { n: '01', title: 'We listen', text: 'What you do, who it is for, and what is already online.' },
      { n: '02', title: 'We plan', text: 'Only what you need now. The rest can wait.' },
      { n: '03', title: 'We build', text: 'You see it as we go. No months of silence.' },
      { n: '04', title: 'We stay', text: 'If something breaks or you want more, there is someone to call.' },
    ],
    payNow: '20%',
    payLater: '80%',
    payNowNote: 'When we start. Domain, hosting, the work begins.',
    payLaterNote: 'When we hand it over, and you can use it.',
    payLine: "YOU DON'T HAVE TO PAY ALL AT ONCE",
    helpLine: 'YOU CAN CHOOSE FROM SEVERAL OPTIONS',
    journeyLine: 'YOU CAN FOLLOW THE WHOLE PROCESS',
    workTitle: 'How we work',
    punchLeft: 'A website',
    punchRight: 'Online presence',
    punchNote: 'These are no longer the same thing.',
  },
}
