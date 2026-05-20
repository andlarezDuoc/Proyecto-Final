import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { artists } from '../../../lib/data/artists';

export async function GET() {
  try {
    console.log('Iniciando la migración de datos a Supabase...');

    // Transformamos los datos para que coincidan con los nombres de columna en PostgreSQL
    // (PostgreSQL convierte automáticamente las mayúsculas a minúsculas si no tienen comillas dobles)
    const dataToInsert = artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      styles: artist.styles,
      location: artist.location,
      shortbio: artist.shortBio,
      fullbio: artist.fullBio,
      avatar: artist.avatar,
      portfolio: artist.portfolio,
      experience: artist.experience,
      stats: artist.stats,
      instagram: artist.instagram
    }));

    const { data, error } = await supabase
      .from('artists')
      .upsert(dataToInsert);

    if (error) {
      console.error('Error de Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: '¡Datos de los artistas insertados correctamente en Supabase!',
      count: dataToInsert.length
    });

  } catch (error: any) {
    console.error('Error interno:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
