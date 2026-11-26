import type { LocaleValue } from "./sanity/types";

export const LOCALES = ["fi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Language that locale-less URLs open in (NEXT_PUBLIC_SITE_LOCALE, default "fi" — the Studio's default language). */
export const DEFAULT_LOCALE: Locale = process.env.NEXT_PUBLIC_SITE_LOCALE === "en" ? "en" : "fi";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Reads a Sanity localeString/localeText in `locale`, falling back to the other language. */
export function t(field: LocaleValue, locale: Locale): string {
  if (!field) return "";
  return field[locale] || field.fi || field.en || "";
}

/** Prefixes an app path with the locale: ("fi", "/plans") → "/fi/plans", ("en", "/#plans") → "/en#plans". */
export function localePath(locale: Locale, path: string) {
  if (path === "/" || path === "") return `/${locale}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/**
 * Language that `x-default` and cross-language canonicals point to:
 * DEFAULT_LOCALE when the page exists in it, otherwise the first available one.
 */
export function preferredLocale(available: readonly Locale[]): Locale {
  return available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : (available[0] ?? DEFAULT_LOCALE);
}

/** Matches a leading locale segment, e.g. "/fi" in "/fi/plans". */
export const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

/** Swaps the locale segment of a pathname (used by the language switcher). */
export function switchLocalePath(pathname: string, to: Locale) {
  const rest = pathname.replace(LOCALE_PREFIX, "");
  return `/${to}${rest}`;
}

const dictionary = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      plans: "Plans",
      faq: "FAQ",
      blog: "Blog",
      contact: "Contact",
    },
    subscribeNow: "Subscribe Now",
    explorePlans: "Explore Plans",
    contactUs: "Contact Us",
    menu: "Menu",
    backToTop: "Back to top",
    hero: {
      live: "Live",
      badge: "Professional IPTV Service",
      title: "Experience a World of Entertainment Without Limits",
      desc: "Enjoy thousands of live channels, movies, and series in stunning quality, anytime and anywhere.",
      stats: [
        ["+10K", "Live Channels"],
        ["4K", "Picture Quality"],
        ["24/7", "Support"],
        ["99%", "Uptime"],
      ],
    },
    channelsLabel: "Channels included",
    alt: {
      hero: "IPTV Finland: live Finnish TV channels, sports and movies on a Smart TV",
      channel: "{name} logo – live TV channel on IPTV Finland",
      movie: "{name} poster – stream it with IPTV Finland",
      plan: "{name} – IPTV Finland subscription plan",
      post: "{name} – IPTV Finland blog",
      section: "{name} – IPTV Finland streaming service",
    },
    movies: {
      label: "Movies & Series",
      title: "Blockbusters and Hit Series",
      sub: "The latest films and the most popular series, ready to stream whenever you want.",
    },
    language: "Language",
    about: {
      label: "About Us",
      title: "An Entertainment Experience Like No Other",
      imageAlt: "IPTV Finland streaming service on Smart TV, phone and tablet",
    },
    features: {
      label: "Why Choose Us",
      title: "Everything You Need in One Subscription",
      sub: "Live TV, movies, sports and series in sharp quality on every screen you own, backed by round-the-clock support.",
      items: [
        { stat: "18,000+ Channels", title: "Live TV Channels", text: "Access thousands of international, national, news, documentary, and entertainment networks from the US, UK, Europe, Middle East, and worldwide." },
        { stat: "60,000+ VOD", title: "Movies & TV Series", text: "Binge the latest box-office premieres, trending series, and classic cinema on demand with multi-language subtitles and Dolby Surround sound." },
        { stat: "PPV & 60 FPS", title: "Live Sports", text: "Never miss a goal or knockout. Watch top football leagues, Formula 1, UFC PPV events, NBA, and NFL in smooth 60fps feeds." },
        { stat: "4K UHD / HEVC", title: "HD & 4K Streaming", text: "Powered by H.265 HEVC compression and adaptive bitrate streaming so you enjoy razor-sharp 4K, Full HD, and HD playback on any internet speed." },
        { stat: "All Platforms", title: "Multi-Device Compatibility", text: "Stream effortlessly across Samsung & LG Smart TVs, Amazon Firestick, Apple TV, Android boxes, iOS, Windows, Mac, and MAG portals." },
        { stat: "EPG + Catch-Up", title: "24/7 Entertainment", text: "Non-stop round-the-clock streaming complete with a real-time Electronic Program Guide (EPG), 7-day TV catch-up, and dedicated 24/7 assistance." },
      ],
    },
    plans: {
      label: "Plans",
      title: "Choose the Plan That Fits You",
      sub: "Enjoy the best streaming experience with flexible plans built around your needs.",
      bestSeller: "⭐ Best Seller",
      sold: "sold",
      save: "Save",
      showDetails: "Show details",
      hideDetails: "Hide details",
      prev: "Previous plans",
      next: "Next plans",
      empty: "Plans will be available soon.",
      oneTime: "One-time payment",
    },
    faq: {
      label: "FAQ",
      title: "Everything You Need to Know",
      empty: "No questions yet.",
    },
    blog: {
      label: "Blog",
      title: "News & Guides",
      readMore: "Read more",
      empty: "No articles published yet.",
      back: "← Back to blog",
      prev: "← Newer",
      next: "Older →",
      by: "by",
    },
    order: {
      title: "Order this plan",
      sub: "Leave your details and we will contact you to activate your subscription.",
      fullname: "Full name",
      phone: "Phone",
      phoneCode: "Country code",
      email: "Email",
      submit: "Place order",
      sending: "Sending…",
      success: "Thank you! Your order was received. We will contact you shortly.",
      whatsapp: "Message us on WhatsApp",
      back: "← All plans",
    },
    contact: {
      label: "Contact",
      title: "Get in Touch",
      sub: "Questions about a plan or setup? Send us a message and we will reply quickly.",
      fullname: "Full name",
      phone: "Phone",
      phoneCode: "Country code",
      email: "Email",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      sending: "Sending…",
      success: "Thank you! Your message was sent.",
      whatsapp: "WhatsApp",
      emailLabel: "Email",
      facebook: "Facebook",
      address: "Address",
    },
    form: {
      required: "Please fill in all required fields.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      failed: "Something went wrong. Please try again or contact us on WhatsApp.",
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact Us",
      rights: "All rights reserved",
      tagline: "Unlimited Entertainment 🎬",
      sitemap: "Sitemap",
      policy: "Refund Policy",
      desc: "Premium IPTV with diverse content and effortless streaming on any screen.",
      ctaTitle: "Start watching in minutes",
      ctaText: "Pick a plan, get your login details and stream live TV, movies and series on any device.",
    },
    policy: {
      label: "Policy",
      title: "Delivery & Refund Policy",
      sub: "How you receive your subscription, the free trial, and how refunds work.",
      sections: [
        [
          "📩 Delivery",
          "IPTV Pro is a digital service: nothing is shipped. After your payment is confirmed, we send your activation code and setup instructions by email or WhatsApp. Delivery is free and usually takes a few minutes, at most 24 hours.",
        ],
        [
          "🎁 1-day free trial",
          "Before you buy, you can ask for a free 24-hour test so you can check the channels, picture quality and stability on your own devices. Contact us to request your trial.",
        ],
        [
          "💸 Refunds",
          "You can ask for a full refund within 6 days of your purchase. To request it, contact us by email or WhatsApp with your order details. Refunds are free and go back to your original payment method.",
        ],
        [
          "📞 Questions",
          "If anything is unclear, contact us and we will help you.",
        ],
      ],
    },
    sitemap: {
      label: "Sitemap",
      title: "Sitemap",
      sub: "Every page of our site in one place: plans, guides and help.",
      pages: "Pages",
      plans: "Plans",
      blog: "Blog articles",
      otherLanguage: "Available in Finnish only",
      updated: "Updated",
    },
    notFound: {
      title: "Page not found",
      text: "The page you are looking for does not exist or was moved.",
      back: "Back to home",
    },
  },
  fi: {
    nav: {
      home: "Etusivu",
      about: "Tietoa meistä",
      plans: "Paketit",
      faq: "UKK",
      blog: "Blogi",
      contact: "Yhteystiedot",
    },
    subscribeNow: "Tilaa nyt",
    explorePlans: "Katso paketit",
    contactUs: "Ota yhteyttä",
    menu: "Valikko",
    backToTop: "Takaisin ylös",
    hero: {
      live: "Suora",
      badge: "Ammattimainen IPTV-palvelu",
      title: "Koe rajaton viihteen maailma",
      desc: "Nauti tuhansista suorista kanavista, elokuvista ja sarjoista upealla kuvanlaadulla – milloin ja missä tahansa.",
      stats: [
        ["+10K", "Suoraa kanavaa"],
        ["4K", "Kuvanlaatu"],
        ["24/7", "Tuki"],
        ["99%", "Käytettävyys"],
      ],
    },
    channelsLabel: "Sisältyvät kanavat",
    alt: {
      hero: "IPTV Suomi: suorat TV-kanavat, urheilu ja elokuvat Smart TV:llä",
      channel: "{name} logo – suora TV-kanava IPTV Suomessa",
      movie: "{name} juliste – katso IPTV Suomella",
      plan: "{name} – IPTV Suomi -tilauspaketti",
      post: "{name} – IPTV Suomi -blogi",
      section: "{name} – IPTV Suomi -suoratoistopalvelu",
    },
    movies: {
      label: "Elokuvat ja sarjat",
      title: "Menestyselokuvat ja suosikkisarjat",
      sub: "Uusimmat elokuvat ja suosituimmat sarjat valmiina katsottavaksi milloin haluat.",
    },
    language: "Kieli",
    about: {
      label: "Tietoa meistä",
      title: "Ainutlaatuinen viihdekokemus",
      imageAlt: "IPTV Suomi -suoratoistopalvelu Smart TV:llä, puhelimella ja tabletilla",
    },
    features: {
      label: "Miksi valita meidät",
      title: "Kaikki mitä tarvitset yhdellä tilauksella",
      sub: "Suorat lähetykset, elokuvat, urheilu ja sarjat terävänä kaikilla näytöilläsi – ja tuki palveluksessasi vuorokauden ympäri.",
      items: [
        { stat: "18 000+ kanavaa", title: "Suorat TV-kanavat", text: "Tuhansia kansainvälisiä ja kotimaisia uutis-, dokumentti- ja viihdekanavia Yhdysvalloista, Britanniasta, Euroopasta, Lähi-idästä ja kaikkialta maailmasta." },
        { stat: "60 000+ VOD", title: "Elokuvat ja TV-sarjat", text: "Katso uusimmat elokuvateattereiden ensi-illat, suosituimmat sarjat ja klassikot milloin vain – monikielisillä tekstityksillä ja Dolby Surround -äänellä." },
        { stat: "PPV & 60 FPS", title: "Suora urheilu", text: "Älä missaa yhtään maalia tai tyrmäystä. Seuraa huippujalkapalloliigoja, Formula 1:tä, UFC PPV -tapahtumia, NBA:ta ja NFL:ää sulavina 60 fps -lähetyksinä." },
        { stat: "4K UHD / HEVC", title: "HD- ja 4K-suoratoisto", text: "H.265 HEVC -pakkaus ja mukautuva bittinopeus takaavat veitsenterävän 4K-, Full HD- ja HD-kuvan millä tahansa nettiyhteydellä." },
        { stat: "Kaikki alustat", title: "Toimii kaikilla laitteilla", text: "Suoratoista vaivatta Samsungin ja LG:n Smart TV:issä, Amazon Firestickillä, Apple TV:llä, Android-bokseilla, iOS:llä, Windowsilla, Macilla ja MAG-portaaleilla." },
        { stat: "EPG + Catch-Up", title: "Viihdettä 24/7", text: "Taukoamatonta suoratoistoa ympäri vuorokauden, reaaliaikainen ohjelmaopas (EPG), 7 päivän catch-up ja oma asiakastuki 24/7." },
      ],
    },
    plans: {
      label: "Paketit",
      title: "Valitse sinulle sopiva paketti",
      sub: "Nauti parhaasta suoratoistokokemuksesta joustavilla, tarpeisiisi räätälöidyillä paketeilla.",
      bestSeller: "⭐ Myydyin",
      sold: "myyty",
      save: "Säästä",
      showDetails: "Näytä tiedot",
      hideDetails: "Piilota tiedot",
      prev: "Edelliset paketit",
      next: "Seuraavat paketit",
      empty: "Paketit ovat pian saatavilla.",
      oneTime: "Kertamaksu",
    },
    faq: {
      label: "UKK",
      title: "Kaikki mitä sinun tarvitsee tietää",
      empty: "Ei vielä kysymyksiä.",
    },
    blog: {
      label: "Blogi",
      title: "Uutiset ja oppaat",
      readMore: "Lue lisää",
      empty: "Artikkeleita ei ole vielä julkaistu.",
      back: "← Takaisin blogiin",
      prev: "← Uudemmat",
      next: "Vanhemmat →",
      by: "kirjoittanut",
    },
    order: {
      title: "Tilaa tämä paketti",
      sub: "Jätä yhteystietosi, niin otamme sinuun yhteyttä tilauksesi aktivoimiseksi.",
      fullname: "Koko nimi",
      phone: "Puhelin",
      phoneCode: "Maatunnus",
      email: "Sähköposti",
      submit: "Tee tilaus",
      sending: "Lähetetään…",
      success: "Kiitos! Tilauksesi on vastaanotettu. Otamme sinuun pian yhteyttä.",
      whatsapp: "Lähetä meille viesti WhatsAppissa",
      back: "← Kaikki paketit",
    },
    contact: {
      label: "Yhteystiedot",
      title: "Ota yhteyttä",
      sub: "Kysyttävää paketeista tai asennuksesta? Lähetä meille viesti, niin vastaamme nopeasti.",
      fullname: "Koko nimi",
      phone: "Puhelin",
      phoneCode: "Maatunnus",
      email: "Sähköposti",
      subject: "Aihe",
      message: "Viesti",
      submit: "Lähetä viesti",
      sending: "Lähetetään…",
      success: "Kiitos! Viestisi on lähetetty.",
      whatsapp: "WhatsApp",
      emailLabel: "Sähköposti",
      facebook: "Facebook",
      address: "Osoite",
    },
    form: {
      required: "Täytä kaikki pakolliset kentät.",
      invalidEmail: "Anna kelvollinen sähköpostiosoite.",
      invalidPhone: "Anna kelvollinen puhelinnumero.",
      failed: "Jokin meni vikaan. Yritä uudelleen tai ota meihin yhteyttä WhatsAppissa.",
    },
    footer: {
      quickLinks: "Pikalinkit",
      contact: "Ota yhteyttä",
      rights: "Kaikki oikeudet pidätetään",
      tagline: "Rajatonta viihdettä 🎬",
      sitemap: "Sivukartta",
      policy: "Palautuskäytäntö",
      desc: "Premium-IPTV monipuolisella sisällöllä ja vaivattomalla suoratoistolla kaikille näytöille.",
      ctaTitle: "Aloita katselu minuuteissa",
      ctaText: "Valitse paketti, saat tunnukset heti ja katso suoria kanavia, elokuvia ja sarjoja millä tahansa laitteella.",
    },
    policy: {
      label: "Käytäntö",
      title: "Toimitus- ja palautuskäytäntö",
      sub: "Miten saat tilauksesi, ilmainen kokeilu ja miten palautukset toimivat.",
      sections: [
        [
          "📩 Toimitus",
          "IPTV Pro on digitaalinen palvelu: mitään ei lähetetä postitse. Kun maksusi on vahvistettu, lähetämme aktivointikoodin ja asennusohjeet sähköpostilla tai WhatsAppilla. Toimitus on ilmainen ja kestää yleensä muutaman minuutin, enintään 24 tuntia.",
        ],
        [
          "🎁 1 päivän ilmainen kokeilu",
          "Ennen ostoa voit pyytää ilmaisen 24 tunnin kokeilun, jotta voit tarkistaa kanavat, kuvanlaadun ja vakauden omilla laitteillasi. Ota meihin yhteyttä pyytääksesi kokeilua.",
        ],
        [
          "💸 Palautukset",
          "Voit pyytää täyden hyvityksen 6 päivän kuluessa ostosta. Ota meihin yhteyttä sähköpostilla tai WhatsAppilla ja kerro tilauksesi tiedot. Hyvitys on maksuton ja palautetaan alkuperäiselle maksutavalle.",
        ],
        [
          "📞 Kysymykset",
          "Jos jokin on epäselvää, ota meihin yhteyttä, niin autamme sinua.",
        ],
      ],
    },
    sitemap: {
      label: "Sivukartta",
      title: "Sivukartta",
      sub: "Kaikki sivustomme sivut yhdessä paikassa: paketit, oppaat ja ohjeet.",
      pages: "Sivut",
      plans: "Paketit",
      blog: "Blogiartikkelit",
      otherLanguage: "Saatavilla vain englanniksi",
      updated: "Päivitetty",
    },
    notFound: {
      title: "Sivua ei löytynyt",
      text: "Etsimääsi sivua ei ole olemassa tai se on siirretty.",
      back: "Takaisin etusivulle",
    },
  },
} as const;

type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Widen<U>[] : { [K in keyof T]: Widen<T[K]> };
export type Dict = Widen<(typeof dictionary)["en"]>;

export function getDict(locale: Locale): Dict {
  return dictionary[locale];
}

/** Fills an `alt` template from the dictionary, e.g. altText(ui.alt.movie, "Titanic"). */
export function altText(template: string, name: string) {
  return template.replaceAll("{name}", name);
}
