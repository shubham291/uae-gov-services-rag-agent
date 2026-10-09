import postgres from "postgres";
import { sql } from "../lib/db";
import { embedMany } from "ai";

const documents = [
  {
    content:
      "To renew your Emirates ID, apply through the ICP app or website, upload your passport and photo, and pay the renewal fee. The new card is delivered by courier.",
    source: "emirates-id-renewal",
  },
  {
    content:
      "To renew your UAE residence visa, apply through the ICP Smart Services website or ICP app. You may need your passport, personal photo, medical fitness certificate where applicable, health insurance, and documents supporting your residence category.",
    source: "residence-visa-renewal",
  },
  {
    content:
      "The UAE Golden Visa provides eligible applicants with long-term residence without requiring a traditional sponsor. Eligible categories include investors, entrepreneurs, specialists, exceptional talents, and outstanding students, and applications can be submitted through ICP Smart Services or the ICP app.",
    source: "golden-visa",
  },
  {
    content:
      "If you overstay your permitted UAE residence or visa period and any applicable grace period has ended, an overstay fine may apply. The standard overstay fine is AED 50 per day, although the applicable grace period depends on the visa or residence category.",
    source: "visa-overstay-fines",
  },
  {
    content:
      "You can view and pay your DEWA electricity and water bills through the DEWA website or DEWA Smart App. You can log in using UAE Pass or your DEWA credentials, select your account, review the bill, and pay using an available payment method.",
    source: "dewa-bills",
  },
  {
    content:
      "Salik is Dubai’s electronic road toll system. Drivers need a Salik tag on the vehicle and must maintain sufficient balance in their Salik account; the account can be managed and recharged through Salik’s online services.",
    source: "salik-tolls",
  },
  {
    content:
      "Traffic fines can be checked and paid through official channels such as Dubai Police, Abu Dhabi Police, RTA, the Ministry of Interior, and the Emirates Vehicle Gate. Select the relevant authority, check the outstanding fine details, and complete the payment online.",
    source: "traffic-fines",
  },
  {
    content:
      "Driving licences can be renewed online through the relevant emirate’s transport authority. In Dubai, licence renewal is available through RTA services, and outstanding traffic fines may need to be paid before completing the renewal.",
    source: "driving-licence-renewal",
  },
  {
    content:
      "An Ejari tenancy contract in Dubai can be registered or renewed through the Dubai REST App or a Real Estate Services Trustee Centre. Required documents can include the Unified Tenancy Contract and Emirates ID, and an Ejari registration certificate is issued after approval.",
    source: "ejari-tenancy-registration",
  },
  {
    content:
      "A Nol card is used to pay for public transport in Dubai, including Metro, Tram, buses, and other RTA transport services. Users should maintain enough balance on the card to pay for their journeys, and the card can be topped up through RTA channels.",
    source: "nol-card",
  },
  {
    content:
      "A medical fitness test is required for many expatriates applying for or renewing a UAE residence visa. Applicants attend an approved medical fitness centre and may need to provide their Emirates ID or passport, registration form, and a recent photograph.",
    source: "medical-fitness-test",
  },
  {
    content:
      "DEWA customers can view their current and previous bills through the DEWA website or Smart App. After logging in, customers can access their account, review bill amounts and payment history, and manage their DEWA services.",
    source: "dewa-bill-history",
  },
  {
    content:
      "DEWA bills can also be paid through the Dubai Now app. Users can log in using UAE Pass, select the bills section, choose DEWA, enter their DEWA account details, confirm the amount, and complete the payment.",
    source: "dewa-payment-dubai-now",
  },
  {
    content:
      "Golden Visa applicants must provide documents proving that they meet the eligibility requirements for their specific category. Applications and nominations can be submitted through ICP Smart Services or the ICP Smart App, followed by uploading the required supporting documents.",
    source: "golden-visa-application",
  },
  {
    content:
      "Ejari registration allows a Dubai tenancy contract to be officially registered with the Dubai Land Department. Tenants can use the Dubai REST App or visit a Real Estate Services Trustee Centre, submit the required tenancy documents, pay the applicable fees, and receive the Ejari certificate after approval.",
    source: "ejari-registration",
  },
];

async function main() {
  // 2. Create embeddings for all documents in one call
  const { embeddings } = await embedMany({
    model: "openai/text-embedding-3-small",
    values: documents.map((d) => d.content),
  });

  // 3. Save each document with its embedding
  for (let i = 0; i < documents.length; i++) {
    await sql`
      INSERT INTO documents (content, source, embedding)
      VALUES (
        ${documents[i].content},
        ${documents[i].source},
        ${JSON.stringify(embeddings[i])}::vector
      )
    `;
  }
  console.log(`Inserted ${documents.length} documents`);
  await sql.end();
}
main();
