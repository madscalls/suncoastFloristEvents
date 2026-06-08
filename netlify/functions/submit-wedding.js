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

    // Pull all the wedding form fields
    const fields = {
      Bride: formData.get("bride") || "",
      Groom: formData.get("groom") || "",
      Email: formData.get("email") || "",
      Address: formData.get("address") || "",
      "Mobile Number": formData.get("mobileNumber") || "",
      "Wedding Date": formData.get("weddingDate") || "",
      "Ceremony Location": formData.get("ceremonyLocation") || "",
      "Ceremony Address": formData.get("ceremonyAddress") || "",
      "Reception Location": formData.get("receptionLocation") || "",
      "Rehearsal Location": formData.get("rehearsalLocation") || "",
      "Rehearsal Date": formData.get("rehearsalDate") || "",
      "Rehearsal Time": formData.get("rehearsalTime") || "",
      "Gown Style & Color": formData.get("gownStyleColor") || "",
      "Bouquet Details": formData.get("bouquetDetails") || "",
      "Price Range": formData.get("priceRange") || "",
      "Bridesmaids Count": formData.get("bridesmaidsCount") || "",
      "Bridesmaid Gown Style": formData.get("bridesmaidGownStyle") || "",
      "Bridesmaid Bouquet": formData.get("bridesmaidBouquetDetails") || "",
      "Flower Girl Bouquet": formData.get("flowerGirlBouquet") || "",
      "Best Man / Groomsmen": formData.get("bestManDetails") || "",
      "Fathers / Grandfathers": formData.get("fathersDetails") || "",
      "Ring Bearer": formData.get("ringBearerDetails") || "",
      "Bride's Mother Dress": formData.get("bridesMotherDress") || "",
      "Groom's Mother Dress": formData.get("groomsMotherDress") || "",
      "Grandmothers Count": formData.get("grandmothersCount") || "",
      "Other Corsages": formData.get("otherCorsagesCount") || "",
      "Main Altar": formData.get("mainAltar") || "",
      "Aisle & Pew": formData.get("aislePew") || "",
      "Head Table": formData.get("headTable") || "",
      "Cake Table": formData.get("cakeTable") || "",
      Centerpieces: formData.get("centerpieces") || "",
      "Reception Notes": formData.get("receptionNotes") || "",
    };

    const attachments = formData.getAll("attachments");
    const imageNames = attachments.map((f) => f.name).join(", ") || "None";

    // Format email body
    const emailBody = Object.entries(fields)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");

    // Build email attachments
    const emailAttachments = await Promise.all(
      attachments.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    // Send email
    await resend.emails.send({
      from: "submissions@yourdomain.com",
      to: process.env.CLIENT_EMAIL,
      subject: `New Wedding Submission — ${fields.Bride} & ${fields.Groom}`,
      text: `New wedding form submission:\n\n${emailBody}\n\nAttached Images: ${imageNames}`,
      attachments: emailAttachments,
    });

    // Log to Notion
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_WEDDING_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: `${fields.Bride} & ${fields.Groom}` } }],
        },
        Email: { email: fields.Email },
        "Wedding Date": {
          rich_text: [{ text: { content: fields["Wedding Date"] } }],
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
  path: "/api/submit-wedding",
};
