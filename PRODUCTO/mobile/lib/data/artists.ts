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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121910_Instagram-g3B6A1VR4NIuJaSGyajbfOzNpG1JmS.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122256_Instagram-oTwd2dTHPHrSJLR8wy0Y1qzy6QmDuh.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121858_Instagram-mjSSHytcgMdozG11I1PLF7kHiB5vAo.jpg"
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121838_Instagram-ARH5xbbypcxE8zCSUvKR0tN1iYINpQ.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121751_Instagram-kxH09PFM0dOeMIPozW7f1z8h1naFhJ.jpg"
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122256_Instagram-oTwd2dTHPHrSJLR8wy0Y1qzy6QmDuh.jpg"
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121933_Instagram-PuSnfwW7gTe9F7daDyPWXtvrdbLvRN.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121858_Instagram-mjSSHytcgMdozG11I1PLF7kHiB5vAo.jpg"
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121910_Instagram-g3B6A1VR4NIuJaSGyajbfOzNpG1JmS.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122012_Instagram-gXFwYBZ21J4FZubK8jEqVMxkwpO7T8.jpg"
    ],
    experience: 10,
    stats: {
      tattoos: "800+",
      rating: "5.0"
    },
    instagram: "@valdes_ink"
  }
];
