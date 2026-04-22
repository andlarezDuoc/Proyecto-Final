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
    id: "marcos-silva",
    name: "Marcos Silva",
    styles: ["Realismo", "Blackwork"],
    location: "Santiago Centro",
    shortBio: "Realismo de alto contraste y sombras profundas.",
    fullBio: "Amante de los contrastes, mi estilo se basa en el realismo y las sombras. Logro capturar miradas y emociones en cada tatuaje, usando mi experiencia para darle vida a cada diseño.",
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=600&auto=format&fit=crop",
    portfolio: [
      "/marcos-silva/1.png",
      "/marcos-silva/2.png",
      "/marcos-silva/3.png",
      "/marcos-silva/4.png",
      "/marcos-silva/5.png",
      "/marcos-silva/6.png",
      "/marcos-silva/7.png",
      "/marcos-silva/8.png"
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
  },
  {
    id: "lucas-maldonado",
    name: "Lucas Maldonado",
    styles: ["Geométrico", "Blackwork"],
    location: "Santiago Centro",
    shortBio: "Mandales y geometrías sagradas con puntos.",
    fullBio: "Especialista en Dotwork y geometría sagrada. Diseños que combinan precisión matemática con arte espiritual.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?w=800", "https://images.unsplash.com/photo-1611501271465-0ae099bceb68?w=800"],
    experience: 6,
    stats: { tattoos: "320+", rating: "4.8" },
    instagram: "@lucas.geo"
  },
  {
    id: "valeria-castro",
    name: "Valeria Castro",
    styles: ["Acuarela", "Fine Line"],
    location: "Vitacura",
    shortBio: "Manchas de acuarela y líneas poéticas.",
    fullBio: "Me encanta dar vida a la piel con colores fluidos y tatuajes que parecen pinturas al agua.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1542458428-ecdcabb8db54?w=800"],
    experience: 4,
    stats: { tattoos: "180+", rating: "4.9" },
    instagram: "@vale.watercolor"
  },
  {
    id: "diego-rivera",
    name: "Diego Rivera",
    styles: ["Neotradicional"],
    location: "Providencia",
    shortBio: "Ilustración neotradicional a todo color.",
    fullBio: "Piezas llenas de detalle, colores densos pero combinados con técnicas ilustrativas modernas.",
    avatar: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1590246814883-57832efa6a73?w=800"],
    experience: 8,
    stats: { tattoos: "400+", rating: "5.0" },
    instagram: "@diego.neo"
  },
  {
    id: "paula-fernandez",
    name: "Paula Fernández",
    styles: ["Anime", "Minimalismo"],
    location: "Ñuñoa",
    shortBio: "Otaku de corazón, líneas puras.",
    fullBio: "Dedico mi vida a tatuar a los personajes favoritos de mi infancia, con líneas muy limpias y sólidas.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1634149842468-b7c1265913af?w=800"],
    experience: 5,
    stats: { tattoos: "250+", rating: "4.7" },
    instagram: "@paula.anime"
  },
  {
    id: "matias-soto",
    name: "Matías Soto",
    styles: ["Tradicional"],
    location: "Las Condes",
    shortBio: "Old School clásico e inquebrantable.",
    fullBio: "Estilo old school puro, directo y nostálgico. Águilas, panteras, rosas y dagas de la manera tradicional.",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1621252179027-94459d278660?w=800"],
    experience: 15,
    stats: { tattoos: "2000+", rating: "4.9" },
    instagram: "@matias_oldschool"
  },
  {
    id: "antonia-rios",
    name: "Antonia Ríos",
    styles: ["Realismo"],
    location: "La Florida",
    shortBio: "Micro-realismo y retratos.",
    fullBio: "Traspaso fotografías a la piel en dimensiones muy reducidas, aplicando técnicas de micro-realismo que impactan.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1574516757650-6a75f8f537db?w=800"],
    experience: 7,
    stats: { tattoos: "400+", rating: "5.0" },
    instagram: "@antonia.micro"
  },
  {
    id: "nicolas-carrasco",
    name: "Nicolás Carrasco",
    styles: ["Blackwork", "Fine Line"],
    location: "Macul",
    shortBio: "Fauna y flora en negro intenso.",
    fullBio: "Plantas, serpientes, insectos y todo lo que la naturaleza nos ofrece bajo pinceladas exclusivas de blackwork.",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800"],
    experience: 9,
    stats: { tattoos: "550+", rating: "4.8" },
    instagram: "@nico.natureink"
  },
  {
    id: "isidora-morales",
    name: "Isidora Morales",
    styles: ["Minimalismo", "Fine Line"],
    location: "Providencia",
    shortBio: "Pequeños recordatorios en la piel.",
    fullBio: "Mensajes, palabras y siluetas diminutas. Tatuajes discretos para clientes elegantes.",
    avatar: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=600&auto=format&fit=crop&crop=faces&q=80",
    portfolio: ["https://images.unsplash.com/photo-1611501271465-0ae099bceb68?w=800"],
    experience: 2,
    stats: { tattoos: "100+", rating: "4.7" },
    instagram: "@isi.lines"
  },
  {
    id: "rodrigo-araneda",
    name: "Rodrigo Araneda",
    styles: ["Anime", "Geométrico"],
    location: "Santiago Centro",
    shortBio: "Composiciones geométricas complejas.",
    fullBio: "Fusiono personajes queridos del anime con marcos de geometría precisa y matemática. Único en mi tipo.",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=600&auto=format&fit=crop",
    portfolio: ["https://images.unsplash.com/photo-1634149842468-b7c1265913af?w=800"],
    experience: 11,
    stats: { tattoos: "900+", rating: "4.9" },
    instagram: "@rod.geekink"
  },
  {
    id: "camila-espinoza",
    name: "Camila Espinoza",
    styles: ["Acuarela", "Realismo"],
    location: "Vitacura",
    shortBio: "Color y vida en perfecto equilibrio.",
    fullBio: "Si estás buscando un tatuaje gigante que mezcle bases de realismo y fondos acuarelables deslumbrantes, soy tu artista.",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&auto=format&fit=crop&crop=faces&q=80",
    portfolio: ["https://images.unsplash.com/photo-1542458428-ecdcabb8db54?w=800"],
    experience: 14,
    stats: { tattoos: "1500+", rating: "5.0" },
    instagram: "@cami.color"
  }
];
