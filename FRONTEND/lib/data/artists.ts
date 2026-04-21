export type ArtistStyle = "Realismo" | "Blackwork" | "Fine Line" | "Tradicional" | "Neotradicional" | "Minimalismo" | "Geométrico" | "Anime" | "Acuarela";

export type Location = "Santiago Centro" | "Providencia" | "Las Condes" | "Ñuñoa" | "Vitacura" | "Macul" | "La Florida";

export interface Artist {
  id: string;
  name: string;
  styles: ArtistStyle[];
  location: Location;
  shortBio: string;
  fullBio: string;
  avatar: string;
  portfolio: string[];
  experience: number;
  stats: {
    tattoos: string;
    rating: string;
  };
  instagram: string;
}

export const artists: Artist[] = [
  {
    id: "valentina-torres",
    name: "Valentina Torres",
    styles: ["Fine Line", "Blackwork", "Minimalismo", "Geométrico"],
    location: "Providencia",
    shortBio: "Especialista en arte delicado y trazos finos.",
    fullBio: "Desde que tengo memoria, el arte ha sido mi forma de expresión. Empecé mi camino en el mundo del tatuaje hace más de 8 años, y desde entonces cada pieza que creo es una extensión de mi alma. Mi especialidad abarca desde el fine line delicado hasta el blackwork más intenso, siempre buscando capturar la esencia única de cada cliente.",
    avatar: "https://images.unsplash.com/photo-1595064619717-640fb87b9231?q=80&w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611501271465-0ae099bceb68?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634149842468-b7c1265913af?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 8,
    stats: {
      tattoos: "500+",
      rating: "5.0"
    },
    instagram: "@valentinatorres_tattoo"
  },
  {
    id: "marcos-silva",
    name: "Marcos Silva",
    styles: ["Realismo", "Blackwork"],
    location: "Santiago Centro",
    shortBio: "Realismo de alto contraste y sombras profundas.",
    fullBio: "Amante de los contrastes, mi estilo se basa en el realismo y las sombras. Logro capturar miradas y emociones en cada tatuaje, usando mi experiencia para darle vida a cada diseño.",
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1611501271465-0ae099bceb68?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574516757650-6a75f8f537db?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 12,
    stats: {
      tattoos: "1200+",
      rating: "4.9"
    },
    instagram: "@marcos_silvatattoo"
  },
  {
    id: "camila-rojas",
    name: "Camila Rojas",
    styles: ["Tradicional", "Neotradicional"],
    location: "Ñuñoa",
    shortBio: "Colores vibrantes y líneas sólidas del estilo tradicional.",
    fullBio: "Con más de 5 años de experiencia, me especializo en los estilos Tradicional y Neotradicional. Me encantan los colores saturados, las líneas audaces y los diseños clásicos reinventados.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1590246814883-57832efa6a73?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 5,
    stats: {
      tattoos: "350+",
      rating: "4.8"
    },
    instagram: "@camilarojas.tattoo"
  },
  {
    id: "daniel-herrera",
    name: "Daniel Herrera",
    styles: ["Anime", "Acuarela"],
    location: "Las Condes",
    shortBio: "Cultura geek y colores acuarelables en tu piel.",
    fullBio: "Soy un artista apasionado por el manga, anime y los colores llamativos. Mi técnica mezcla la precisión de los mangas con la soltura y belleza de la técnica de acuarela.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1542458428-ecdcabb8db54?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1647464278453-912c2ca7d75c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 4,
    stats: {
      tattoos: "200+",
      rating: "4.7"
    },
    instagram: "@dherrera.animetattoo"
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    styles: ["Geométrico", "Blackwork", "Minimalismo"],
    location: "Vitacura",
    shortBio: "Precisión geométrica y simetría perfecta.",
    fullBio: "Mi enfoque es 100% geométrico. Trabajo la precisión, los patrones repetitivos y mandalas, logrando estructuras sólidas y simétricas sobre el cuerpo.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634149842468-b7c1265913af?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 7,
    stats: {
      tattoos: "450+",
      rating: "4.9"
    },
    instagram: "@sofia.geometric"
  },
  {
    id: "jorge-valdes",
    name: "Jorge Valdés",
    styles: ["Neotradicional", "Tradicional", "Realismo"],
    location: "Santiago Centro",
    shortBio: "Piezas grandes, colores profundos y diseños a medida.",
    fullBio: "Llevo el estilo Neotradicional a otro nivel con piezas grandes, espaldas completas y mangas enteras. 10 años en el rubro avalan mis trazos.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1590246814883-57832efa6a73?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574516757650-6a75f8f537db?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 10,
    stats: {
      tattoos: "800+",
      rating: "5.0"
    },
    instagram: "@valdes_ink"
  },
  {
    id: "andrea-pinto",
    name: "Andrea Pinto",
    styles: ["Fine Line", "Minimalismo", "Acuarela"],
    location: "La Florida",
    shortBio: "Detalles sutiles, mini tatuajes y manchas de color.",
    fullBio: "Me encantan los detalles y los trazos tan finos como un cabello. Ofrezco un espacio seguro y cálido para tener tu primer tatuaje minimalista.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1611501271465-0ae099bceb68?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542458428-ecdcabb8db54?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 3,
    stats: {
      tattoos: "150+",
      rating: "4.6"
    },
    instagram: "@andrea_littletattoos"
  },
  {
    id: "felipe-cortes",
    name: "Felipe Cortés",
    styles: ["Blackwork", "Anime"],
    location: "Macul",
    shortBio: "El lado oscuro del anime y mangas plasmado en negro puro.",
    fullBio: "Integro el estilo Anime y el Blackwork para crear piezas oscuras y llenas de sentimiento de tus personajes favoritos. Mucho contraste y sombras densas.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634149842468-b7c1265913af?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 6,
    stats: {
      tattoos: "400+",
      rating: "4.8"
    },
    instagram: "@x_felipecortes_x"
  },
  {
    id: "ignacio-vega",
    name: "Ignacio Vega",
    styles: ["Realismo"],
    location: "Providencia",
    shortBio: "Retratos realistas de alta definición.",
    fullBio: "Especialista en retratos de animales y personas. Cada obra requiere entre 6 a 10 horas de trabajo para lograr un nivel de detalle fotográfico inigualable.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1574516757650-6a75f8f537db?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 9,
    stats: {
      tattoos: "600+",
      rating: "5.0"
    },
    instagram: "@ignaciovega.realism"
  },
  {
    id: "catalina-ruiz",
    name: "Catalina Ruiz",
    styles: ["Tradicional", "Blackwork"],
    location: "Ñuñoa",
    shortBio: "Diseños tradicionales con un twist moderno.",
    fullBio: "Diseño piezas con inspiración tradicional americana pero adaptadas al gusto actual, utilizando muchísima tinta negra, delineados gruesos y duraderos.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590246814883-57832efa6a73?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542458428-ecdcabb8db54?q=80&w=800&auto=format&fit=crop"
    ],
    experience: 5,
    stats: {
      tattoos: "300+",
      rating: "4.7"
    },
    instagram: "@cata.ruiz.tattoo"
  }
];
