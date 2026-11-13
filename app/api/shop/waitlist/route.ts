import { NextResponse } from "next/server";

const CONTACT = "contact@guitarporn.club";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mailtoFor(email: string): string {
  const subject = "Shop waitlist";
  const body = `Please add me to the GuitarPorn shop waitlist.\n\nEmail: ${email}`;
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Waitlist signup.
 * With RESEND_API_KEY, notifies contact@guitarporn.club.
 * Without it (or if Resend rejects the send), returns a mailto link.
 * No database write, so a missing Supabase setup cannot break this route.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email." },
        { status: 400 },
      );
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      return NextResponse.json({
        ok: true,
        delivered: false,
        mailto: mailtoFor(email),
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `GuitarPorn Club <noreply@guitarporn.club>`,
        to: [CONTACT],
        reply_to: email,
        subject: "Shop waitlist",
        text: `${email} asked to join the shop waitlist.`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: true,
        delivered: false,
        mailto: mailtoFor(email),
      });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: `The waitlist didn't respond. Email ${CONTACT} and we'll add you.`,
      },
      { status: 500 },
    );
  }
}
