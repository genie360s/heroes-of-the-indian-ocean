import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { formType, name, email, organization, country, purpose, contributionType, amount, message } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })

  const isDocumentary = formType === 'documentary'

  const subject = isDocumentary
    ? `🎬 Documentary Request from ${name}`
    : `🌊 Series Contribution Interest from ${name}`

  const accentColor = isDocumentary ? '#0077be' : '#ffbf00'
  const heading = isDocumentary ? 'New Documentary Request' : 'New Series Contribution'

  const rows = isDocumentary
    ? [
        ['Name', name],
        ['Email', `<a href="mailto:${email}" style="color:${accentColor}">${email}</a>`],
        ['Organization', organization || '—'],
        ['Country', country || '—'],
        ['Purpose / Message', purpose || '—']
      ]
    : [
        ['Name', name],
        ['Email', `<a href="mailto:${email}" style="color:${accentColor}">${email}</a>`],
        ['Contribution Type', contributionType || '—'],
        ['Amount (USD)', amount ? `$${amount}` : '—'],
        ['Message', message || '—']
      ]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;color:#888;white-space:nowrap;vertical-align:top;font-size:13px;text-transform:uppercase;letter-spacing:1px">${label}</td>
        <td style="padding:10px 12px;color:#fff;font-size:15px">${value}</td>
      </tr>`
    )
    .join('')

  const html = `
    <div style="background:#0d0d0d;color:#fff;padding:40px 32px;border-radius:12px;font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #1a1a1a">
      <div style="border-left:4px solid ${accentColor};padding-left:16px;margin-bottom:32px">
        <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:2px">Heroes of Indian Ocean</p>
        <h2 style="margin:8px 0 0;color:${accentColor};font-size:24px">${heading}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#161616;border-radius:8px;overflow:hidden">
        ${tableRows}
      </table>
      <p style="margin-top:32px;color:#444;font-size:12px;text-align:center">
        Sent from <a href="https://heroesofindianocean.com" style="color:#444">heroesofindianocean.com</a>
        &nbsp;·&nbsp; ${new Date().toUTCString()}
      </p>
    </div>`

  try {
    await transporter.sendMail({
      from: `"Heroes of Indian Ocean" <${process.env.GMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject,
      html,
      replyTo: email
    })
    return res.status(200).json({ message: 'Message sent successfully.' })
  } catch (err) {
    console.error('Nodemailer error:', err)
    return res.status(500).json({ message: 'Failed to send email. Please try again later.' })
  }
}
