-- ==========================================
-- ESTRUCTURA COMPLETA DE BASE DE DATOS
-- BLACK INK TATTOO
-- ==========================================

-- 1. Tabla de Perfiles Públicos (para Clientes y Tatuadores)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email text NOT NULL,
    role text NOT NULL CHECK (role IN ('client', 'artist')),
    full_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
CREATE POLICY "Permitir lectura de perfiles a todos" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserción de perfiles a usuarios autenticados" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir actualización de perfil propio" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. Tabla de Artistas (con valores por defecto seguros para registro automático)
CREATE TABLE IF NOT EXISTS public.artists (
    id text PRIMARY KEY, -- UID en formato de texto para calzar con la lógica del frontend
    name text NOT NULL,
    email text DEFAULT '' NOT NULL,
    styles text[] DEFAULT '{}'::text[] NOT NULL,
    location text DEFAULT 'Ciudad' NOT NULL,
    shortbio text DEFAULT 'Nuevo artista en Black Ink.' NOT NULL,
    fullbio text DEFAULT 'Biografía en desarrollo.' NOT NULL,
    avatar text DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' NOT NULL,
    portfolio text[] DEFAULT '{}'::text[] NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    stats jsonb DEFAULT '{"rating": 5, "completed": 0, "reviews": 0}'::jsonb NOT NULL,
    instagram text DEFAULT '' NOT NULL
);

-- Habilitar RLS en artists
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para artists
CREATE POLICY "Permitir lectura de artistas a todos" ON public.artists
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserción de artistas a usuarios autenticados" ON public.artists
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Permitir actualización de artistas a dueños de la cuenta" ON public.artists
    FOR UPDATE USING (auth.uid()::text = id);


-- 3. Crear el disco duro (bucket) para el portafolio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de almacenamiento (Storage Policies)
CREATE POLICY "Acceso Público a Portafolio" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Subida Permitida a Tatuadores Autenticados" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );
