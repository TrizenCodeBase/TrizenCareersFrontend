// Email Service for Trizen Careers
// Integrates with the Support Email Service API

import { ENV_CONFIG } from '@/config/environment';

const EMAIL_SERVICE_CONFIG = {
  baseUrl: ENV_CONFIG.EMAIL_SERVICE.BASE_URL,
  apiKey: ENV_CONFIG.EMAIL_SERVICE.API_KEY,
  fromEmail: ENV_CONFIG.EMAIL_SERVICE.FROM_EMAIL,
  fromName: ENV_CONFIG.EMAIL_SERVICE.FROM_NAME
};

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    messageId: string;
    timestamp: string;
  };
  error?: string;
}

export interface JobApplicationEmailData {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  jobId: string;
  companyName: string;
}

class EmailService {
  private async makeRequest(endpoint: string, data: any): Promise<EmailResponse> {
    try {
      console.log('📧 Sending email request to:', `${EMAIL_SERVICE_CONFIG.baseUrl}${endpoint}`);
      console.log('📧 Email data:', data);
      
      const response = await fetch(`${EMAIL_SERVICE_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': EMAIL_SERVICE_CONFIG.apiKey,
        },
        body: JSON.stringify(data),
      });

      console.log('📧 Email response status:', response.status);
      const result = await response.json();
      console.log('📧 Email response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('📧 Email service error:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send job application confirmation email directly to email service
   */
  async sendJobApplicationConfirmation(data: JobApplicationEmailData, token: string): Promise<EmailResponse> {
    const { applicantName, applicantEmail, jobTitle, jobId, companyName } = data;
    
    console.log('📧 Sending email directly to email service...');
    
    try {
      const response = await fetch(`${EMAIL_SERVICE_CONFIG.baseUrl}/api/support/send-custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': EMAIL_SERVICE_CONFIG.apiKey
        },
        body: JSON.stringify({
          clientEmail: applicantEmail,
          clientName: applicantName,
          subject: `Application Confirmation - ${jobTitle} at ${companyName}`,
          message: this.generateJobApplicationEmailContent(data),
          isHtml: false
        })
      });

      console.log('📧 Email service response status:', response.status);
      const result = await response.json();
      console.log('📧 Email service response data:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('📧 Email service error:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate job application confirmation email content
   */
  private generateJobApplicationEmailContent(data: JobApplicationEmailData): string {
    return `
Dear ${data.applicantName},

Thank you for your interest in joining our team at ${data.companyName}!

We have successfully received your application for the position of "${data.jobTitle}" (Job ID: ${data.jobId}).

What happens next:
• Our HR team will review your application within 2-3 business days
• If your profile matches our requirements, we'll contact you for the next steps
• You may be invited for an interview or assessment
• We'll keep you updated throughout the process

Application Details:
• Position: ${data.jobTitle}
• Application ID: ${data.jobId}
• Applied on: ${new Date().toLocaleDateString()}
• Status: Under Review

If you have any questions about your application or the recruitment process, please don't hesitate to contact us at support@trizenventures.com.

We appreciate your interest in ${data.companyName} and look forward to potentially welcoming you to our team!

Best regards,
Trizen Ventures HR Team

---
This is an automated confirmation email. Please do not reply to this email.
For support, contact us at support@trizenventures.com
    `.trim();
  }

  /**
   * Send welcome email for new user registration
   */
  async sendWelcomeEmail(clientEmail: string, clientName: string): Promise<EmailResponse> {
    return this.makeRequest('/api/support/send-welcome', {
      clientEmail,
      clientName
    });
  }

  /**
   * Send support response email
   */
  async sendSupportResponse(
    clientEmail: string, 
    clientName: string, 
    inquiry: string, 
    response: string
  ): Promise<EmailResponse> {
    return this.makeRequest('/api/support/send-support-response', {
      clientEmail,
      clientName,
      inquiry,
      response
    });
  }

  /**
   * Test email service configuration
   */
  async testConfiguration(): Promise<EmailResponse> {
    try {
      const response = await fetch(`${EMAIL_SERVICE_CONFIG.baseUrl}/api/support/test-config`, {
        method: 'GET',
        headers: {
          'X-API-Key': EMAIL_SERVICE_CONFIG.apiKey,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Email service test error:', error);
      return {
        success: false,
        message: 'Failed to test email configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if email service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${EMAIL_SERVICE_CONFIG.baseUrl}/health`);
      const result = await response.json();
      return response.ok && result.status === 'healthy';
    } catch (error) {
      console.error('Email service health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
