export default function handler(req, res) {
  // Bunu görmüyorsan, bu dosya deploy olmuyor demektir.
  return res.status(200).send("STAMP_OK_GHOSTIFY_VERIFY_V9");
}
