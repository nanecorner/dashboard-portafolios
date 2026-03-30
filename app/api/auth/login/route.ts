import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { makeToken } from "@/lib/auth";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña requeridos" }, { status: 400 });
    }

    // El "username" es el slug del perfil
    const profile = await prisma.profile.findUnique({
      where: { slug: username },
    });

    if (!profile) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    // Comparación simple de contraseña (texto plano según solicitud)
    if (profile.password !== password) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Crear la sesión
    const token = makeToken(profile.id, profile.slug);

    const response = NextResponse.json({ 
      success: true, 
      profileId: profile.id 
    });

    response.cookies.set("dash_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
