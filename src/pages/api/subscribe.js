import axios from "axios";
import EmailValidator from "email-validator";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

export default async function (req, res) {
  let email = req.body.email;
  const {opt_in} = req.body;
  if (opt_in) {
    // prevent spam
    return res.status(200).json({ email });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!EmailValidator.validate(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  email = email.toLowerCase();
  const airtableEmailResponse = await axios.get(
    `${AIRTABLE_API_URL}/?filterByFormula=email="${email}"`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );
  if (airtableEmailResponse.data.records.length === 0) {
    const response = await axios.post(
      AIRTABLE_API_URL,
      {
        fields: {
          email: email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return res.status(200).json({ email });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    return res.status(200).json({ email });
  }
}
