// External Service Mocks - Stripe, Email, SMS
// Mock implementations with realistic delays and responses
// Replace with real integrations in production

// ============================================================================
// STRIPE MOCK SERVICE
// ============================================================================

export type StripeProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  tier: 'foundation' | 'performance' | 'adaptive' | 'longevity';
};

export type StripePaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_confirmation' | 'canceled';
  client_secret: string;
  created: number;
};

export type StripeSubscription = {
  id: string;
  customer: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        product: string;
        unit_amount: number;
        recurring: {
          interval: 'month' | 'year';
        };
      };
    }>;
  };
};

export const stripeMockService = {
  // Mock products/prices
  products: [
    {
      id: 'prod_foundation',
      name: 'Foundation Tier',
      description: 'Essential fitness coaching',
      price: 4900, // $49/month in cents
      interval: 'month' as const,
      tier: 'foundation' as const
    },
    {
      id: 'prod_performance',
      name: 'Performance Tier',
      description: 'Advanced coaching with AI assistance',
      price: 9900, // $99/month
      interval: 'month' as const,
      tier: 'performance' as const
    },
    {
      id: 'prod_adaptive',
      name: 'Adaptive Tier',
      description: 'Personalized coaching with biomarker tracking',
      price: 19900, // $199/month
      interval: 'month' as const,
      tier: 'adaptive' as const
    },
    {
      id: 'prod_longevity',
      name: 'Longevity Tier',
      description: 'Complete health optimization with in-person training',
      price: 39900, // $399/month
      interval: 'month' as const,
      tier: 'longevity' as const
    }
  ],

  // Create payment intent
  createPaymentIntent: async (amount: number, currency = 'usd'): Promise<StripePaymentIntent> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const paymentIntent: StripePaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      amount,
      currency,
      status: 'succeeded',
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      created: Math.floor(Date.now() / 1000)
    };

    console.log('[Stripe Mock] Payment Intent Created:', paymentIntent);
    return paymentIntent;
  },

  // Create subscription
  createSubscription: async (customerId: string, priceId: string): Promise<StripeSubscription> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const product = stripeMockService.products.find(p => p.id === priceId);
    if (!product) {
      throw new Error('Product not found');
    }

    const now = Math.floor(Date.now() / 1000);
    const subscription: StripeSubscription = {
      id: `sub_mock_${Date.now()}`,
      customer: customerId,
      status: 'active',
      current_period_start: now,
      current_period_end: now + (30 * 24 * 60 * 60), // 30 days
      cancel_at_period_end: false,
      items: {
        data: [{
          id: `si_mock_${Date.now()}`,
          price: {
            id: priceId,
            product: product.id,
            unit_amount: product.price,
            recurring: {
              interval: product.interval
            }
          }
        }]
      }
    };

    console.log('[Stripe Mock] Subscription Created:', subscription);
    return subscription;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string): Promise<StripeSubscription> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const subscription: StripeSubscription = {
      id: subscriptionId,
      customer: 'cus_mock',
      status: 'canceled',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
      cancel_at_period_end: true,
      items: {
        data: []
      }
    };

    console.log('[Stripe Mock] Subscription Canceled:', subscription);
    return subscription;
  },

  // Get subscription
  getSubscription: async (subscriptionId: string): Promise<StripeSubscription> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const now = Math.floor(Date.now() / 1000);
    const subscription: StripeSubscription = {
      id: subscriptionId,
      customer: 'cus_mock',
      status: 'active',
      current_period_start: now,
      current_period_end: now + (30 * 24 * 60 * 60),
      cancel_at_period_end: false,
      items: {
        data: [{
          id: 'si_mock',
          price: {
            id: 'price_mock',
            product: 'prod_performance',
            unit_amount: 9900,
            recurring: {
              interval: 'month'
            }
          }
        }]
      }
    };

    console.log('[Stripe Mock] Subscription Retrieved:', subscription);
    return subscription;
  },

  // Create customer
  createCustomer: async (email: string, name: string): Promise<{ id: string; email: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const customer = {
      id: `cus_mock_${Date.now()}`,
      email,
      name
    };

    console.log('[Stripe Mock] Customer Created:', customer);
    return customer;
  }
};

// ============================================================================
// EMAIL MOCK SERVICE
// ============================================================================

export type EmailTemplate = 
  | 'welcome'
  | 'workout_assigned'
  | 'session_scheduled'
  | 'session_reminder'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_canceled'
  | 'password_reset';

export type Email = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
};

export const emailMockService = {
  // Send email
  sendEmail: async (email: Email): Promise<{ id: string; status: 'sent' }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = {
      id: `email_mock_${Date.now()}`,
      status: 'sent' as const
    };

    console.log('[Email Mock] Email Sent:', {
      to: email.to,
      subject: email.subject,
      id: result.id
    });

    return result;
  },

  // Send template email
  sendTemplateEmail: async (
    to: string,
    template: EmailTemplate,
    data: Record<string, any>
  ): Promise<{ id: string; status: 'sent' }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));

    const templates: Record<EmailTemplate, { subject: string; preview: string }> = {
      welcome: {
        subject: 'Welcome to REPZ!',
        preview: `Hi ${data.name}, welcome to your fitness journey!`
      },
      workout_assigned: {
        subject: 'New Workout Assigned',
        preview: `Your coach has assigned you a new workout: ${data.workoutName}`
      },
      session_scheduled: {
        subject: 'Session Scheduled',
        preview: `Your ${data.sessionType} session is scheduled for ${data.date}`
      },
      session_reminder: {
        subject: 'Session Reminder',
        preview: `Reminder: Your session is in 24 hours`
      },
      payment_success: {
        subject: 'Payment Successful',
        preview: `Your payment of $${data.amount} was successful`
      },
      payment_failed: {
        subject: 'Payment Failed',
        preview: `Your payment failed. Please update your payment method.`
      },
      subscription_canceled: {
        subject: 'Subscription Canceled',
        preview: `Your subscription has been canceled`
      },
      password_reset: {
        subject: 'Reset Your Password',
        preview: `Click here to reset your password`
      }
    };

    const templateData = templates[template];
    const result = {
      id: `email_mock_${Date.now()}`,
      status: 'sent' as const
    };

    console.log('[Email Mock] Template Email Sent:', {
      to,
      template,
      subject: templateData.subject,
      id: result.id
    });

    return result;
  },

  // Send bulk emails
  sendBulkEmails: async (emails: Email[]): Promise<{ sent: number; failed: number }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = {
      sent: emails.length,
      failed: 0
    };

    console.log('[Email Mock] Bulk Emails Sent:', result);
    return result;
  }
};

// ============================================================================
// SMS MOCK SERVICE
// ============================================================================

export type SMS = {
  to: string;
  body: string;
};

export const smsMockService = {
  // Send SMS
  sendSMS: async (sms: SMS): Promise<{ id: string; status: 'sent' }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = {
      id: `sms_mock_${Date.now()}`,
      status: 'sent' as const
    };

    console.log('[SMS Mock] SMS Sent:', {
      to: sms.to,
      body: sms.body.substring(0, 50) + '...',
      id: result.id
    });

    return result;
  },

  // Send session reminder
  sendSessionReminder: async (to: string, sessionDate: string, sessionType: string): Promise<{ id: string; status: 'sent' }> => {
    const body = `Reminder: Your ${sessionType} session is scheduled for ${sessionDate}. See you there!`;
    return smsMockService.sendSMS({ to, body });
  },

  // Send workout notification
  sendWorkoutNotification: async (to: string, workoutName: string): Promise<{ id: string; status: 'sent' }> => {
    const body = `New workout assigned: ${workoutName}. Check your app to get started!`;
    return smsMockService.sendSMS({ to, body });
  }
};

// ============================================================================
// NOTIFICATION SERVICE (Combines Email + SMS)
// ============================================================================

export const notificationService = {
  // Send welcome notification
  sendWelcome: async (email: string, phone: string, name: string) => {
    const [emailResult, smsResult] = await Promise.all([
      emailMockService.sendTemplateEmail(email, 'welcome', { name }),
      smsMockService.sendSMS({
        to: phone,
        body: `Welcome to REPZ, ${name}! Your fitness journey starts now. 💪`
      })
    ]);

    return { email: emailResult, sms: smsResult };
  },

  // Send workout assigned notification
  sendWorkoutAssigned: async (email: string, phone: string, workoutName: string, date: string) => {
    const [emailResult, smsResult] = await Promise.all([
      emailMockService.sendTemplateEmail(email, 'workout_assigned', { workoutName, date }),
      smsMockService.sendWorkoutNotification(phone, workoutName)
    ]);

    return { email: emailResult, sms: smsResult };
  },

  // Send session reminder
  sendSessionReminder: async (email: string, phone: string, sessionType: string, date: string) => {
    const [emailResult, smsResult] = await Promise.all([
      emailMockService.sendTemplateEmail(email, 'session_reminder', { sessionType, date }),
      smsMockService.sendSessionReminder(phone, date, sessionType)
    ]);

    return { email: emailResult, sms: smsResult };
  },

  // Send payment success notification
  sendPaymentSuccess: async (email: string, amount: number, tier: string) => {
    return emailMockService.sendTemplateEmail(email, 'payment_success', { amount, tier });
  },

  // Send payment failed notification
  sendPaymentFailed: async (email: string) => {
    return emailMockService.sendTemplateEmail(email, 'payment_failed', {});
  }
};

// ============================================================================
// FILE UPLOAD MOCK SERVICE
// ============================================================================

export const fileUploadMockService = {
  // Upload file
  uploadFile: async (file: File, folder: string): Promise<{ url: string; path: string }> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileName = `${Date.now()}-${file.name}`;
    const path = `${folder}/${fileName}`;
    const url = `https://mock-cdn.example.com/${path}`;

    console.log('[File Upload Mock] File Uploaded:', {
      name: file.name,
      size: file.size,
      type: file.type,
      url
    });

    return { url, path };
  },

  // Upload avatar
  uploadAvatar: async (file: File, userId: string): Promise<string> => {
    const { url } = await fileUploadMockService.uploadFile(file, `avatars/${userId}`);
    return url;
  },

  // Upload workout video
  uploadWorkoutVideo: async (file: File, exerciseId: string): Promise<string> => {
    const { url } = await fileUploadMockService.uploadFile(file, `workout-videos/${exerciseId}`);
    return url;
  },

  // Upload progress photo
  uploadProgressPhoto: async (file: File, clientId: string): Promise<string> => {
    const { url } = await fileUploadMockService.uploadFile(file, `progress-photos/${clientId}`);
    return url;
  },

  // Delete file
  deleteFile: async (path: string): Promise<void> => {
    // Simulate delete delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('[File Upload Mock] File Deleted:', path);
  }
};

// ============================================================================
// VIDEO STREAMING MOCK SERVICE
// ============================================================================

export const videoStreamingMockService = {
  // Create video asset
  createVideoAsset: async (file: File): Promise<{ id: string; playbackUrl: string; thumbnailUrl: string }> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const asset = {
      id: `video_mock_${Date.now()}`,
      playbackUrl: `https://mock-video-cdn.example.com/videos/${Date.now()}.m3u8`,
      thumbnailUrl: `https://mock-video-cdn.example.com/thumbnails/${Date.now()}.jpg`
    };

    console.log('[Video Streaming Mock] Video Asset Created:', asset);
    return asset;
  },

  // Get video playback URL
  getPlaybackUrl: async (videoId: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return `https://mock-video-cdn.example.com/videos/${videoId}.m3u8`;
  },

  // Delete video
  deleteVideo: async (videoId: string): Promise<void> => {
    // Simulate delete delay
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('[Video Streaming Mock] Video Deleted:', videoId);
  }
};

// Export all services
export default {
  stripe: stripeMockService,
  email: emailMockService,
  sms: smsMockService,
  notification: notificationService,
  fileUpload: fileUploadMockService,
  videoStreaming: videoStreamingMockService
};
