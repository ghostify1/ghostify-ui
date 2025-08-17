
export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email gerekli" });
  }

  // Demo sonuç
  res.status(200).json({
    email,
    breaches: [
      { source: "HaveIBeenPwned", found: true, date: "2021-03-05" },
      { source: "LeakCheck", found: false }
    ],
    status: "Demo sonuc"
  });
}
