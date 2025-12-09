import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Coach email (you can change this)
const COACH_EMAIL = 'alawein@gmail.com'; // Change to your email

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const clientData = req.body;

      // Log the intake
      console.log('=== NEW INTAKE SUBMISSION ===');
      console.log('Client:', clientData.full_name);
      console.log('Email:', clientData.email);
      console.log('Phone:', clientData.phone);
      console.log('Tier:', clientData.payment_type);
      console.log('Submitted:', clientData.created_at);
      console.log('=============================');

      // Send email notification to coach
      try {
        const emailData = {
          from: 'REPZ Intake <noreply@repzcoach.com>',
          to: [COACH_EMAIL],
          subject: `New Intake: ${clientData.full_name} (${clientData.payment_type})`,
          html: `
            <h2>🎯 New Client Intake Submission</h2>
            <p><strong>Client:</strong> ${clientData.full_name}</p>
            <p><strong>Email:</strong> ${clientData.email}</p>
            <p><strong>Phone:</strong> ${clientData.phone}</p>
            <p><strong>Selected Tier:</strong> ${clientData.payment_type}</p>
            <p><strong>Submitted:</strong> ${new Date(clientData.created_at).toLocaleString()}</p>

            <h3>📋 Intake Details:</h3>
            <ul>
              <li><strong>Age:</strong> ${clientData.intake_data.age}</li>
              <li><strong>Sex:</strong> ${clientData.intake_data.sex}</li>
              <li><strong>Height:</strong> ${clientData.intake_data.height}</li>
              <li><strong>Weight:</strong> ${clientData.intake_data.weight}</li>
              <li><strong>Activity Level:</strong> ${clientData.intake_data.activityLevel}</li>
              <li><strong>Primary Goals:</strong> ${clientData.intake_data.primaryGoals}</li>
              <li><strong>Training Frequency:</strong> ${clientData.intake_data.trainingFrequency}</li>
              <li><strong>Timeline:</strong> ${clientData.intake_data.timeline}</li>
            </ul>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the full intake data</li>
              <li>Contact the client within 48 hours</li>
              <li>Create their personalized plan</li>
              <li>Set up payment if needed</li>
            </ol>

            <hr>
            <p><small>This is an automated notification from REPZ Platform</small></p>
          `,
        };

        await resend.emails.send(emailData);
        console.log('✅ Email notification sent to coach');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Continue even if email fails
      }

      return res.status(200).json({
        success: true,
        message: 'Intake received',
        clientId: clientData.id,
      });
    } catch (error) {
      console.error('Intake API error:', error);
      return res.status(500).json({ error: 'Failed to process intake' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Intake API ready',
      intakes: [],
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
