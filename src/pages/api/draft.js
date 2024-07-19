export default function handler(req, res) {
    if (req.query.token === process.env.PREVIEW_TOKEN) {
        res.setDraftMode({ enable: true })
        res.redirect(307, "/");
    }
    else {
        res.setDraftMode({ enable: false })
        res.json({ status: 'Draft Mode Disabled' })
    }
}