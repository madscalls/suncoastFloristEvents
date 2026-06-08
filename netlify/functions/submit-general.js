import { Resend } from "resend";
import { Client } from "@notionhq/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();

    const fields = {
      Name: formData.get("name") || "",
      Email: formData.get("email") || "",
      Phone: formData.get("phone") || "",
      Occasion: formData.get("occasion") || "",
      "Event Date": formData.get("eventDate") || "",
      "Guest Count": formData.get("guestCount") || "",
      Budget: formData.get("budget") || "",
      Notes: formData.get("notes") || "",
    };

    const attachments = formData.getAll("attachments");
    const imageNames = attachments.map((f) => f.name).join(", ") || "None";

    const emailBody = Object.entries(fields)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");

    const emailAttachments = await Promise.all(
      attachments.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    await resend.emails.send({
      from: "submissions@yourdomain.com",
      to: process.env.CLIENT_EMAIL,
      subject: `New General Submission — ${fields.Name}`,
      text: `New general event submission:\n\n${emailBody}\n\nAttached Images: ${imageNames}`,
      attachments: emailAttachments,
    });

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_GENERAL_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: fields.Name } }],
        },
        Email: { email: fields.Email },
        Occasion: {
          rich_text: [{ text: { content: fields.Occasion } }],
        },
        "Date Submitted": {
          date: { start: new Date().toISOString() },
        },
        "Attached Images": {
          rich_text: [{ text: { content: imageNames } }],
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Submitted successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Something went wrong." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/submit-general",
};
