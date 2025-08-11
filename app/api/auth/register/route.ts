// app/api/auth/register/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as z from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Création du client Supabase
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

// La fonction doit être exportée et s'appeler POST en majuscules
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = registerSchema.parse(body);

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: rpcError } = await supabase.rpc('assign_random_color_to_new_user', {
        p_username: username,
        p_email: email,
        p_password_hash: hashedPassword
    });

    if (rpcError || !data || data.length === 0) {
      console.error('Erreur RPC Supabase:', rpcError);
      return NextResponse.json({ error: 'Erreur lors de l\'attribution de la couleur.' }, { status: 500 });
    }
    
    const result = data[0];
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Erreur interne du serveur:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}