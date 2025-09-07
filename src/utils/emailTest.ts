// Email Service Test Utility
// This file can be used to test email functionality during development

import { emailService } from '@/services/emailService';

export const testEmailService = async () => {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const isHealthy = await emailService.checkHealth();
    console.log('✅ Health check:', isHealthy ? 'PASSED' : 'FAILED');
    
    // Test 2: Configuration Test
    console.log('2. Testing configuration...');
    const configResult = await emailService.testConfiguration();
    console.log('✅ Configuration test:', configResult.success ? 'PASSED' : 'FAILED');
    if (!configResult.success) {
      console.error('❌ Config error:', configResult.message);
    }
    
    // Test 3: Sample Job Application Email (commented out to avoid sending real emails)
    /*
    console.log('3. Testing job application email...');
    const emailResult = await emailService.sendJobApplicationConfirmation({
      applicantName: 'Test User',
      applicantEmail: 'test@example.com',
      jobTitle: 'Test Job Position',
      jobId: 'TEST-001',
      companyName: 'Trizen Ventures'
    });
    console.log('✅ Email test:', emailResult.success ? 'PASSED' : 'FAILED');
    if (!emailResult.success) {
      console.error('❌ Email error:', emailResult.message);
    }
    */
    
    console.log('🎉 Email service testing completed!');
    return true;
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    return false;
  }
};

// Export for use in browser console during development
if (typeof window !== 'undefined') {
  (window as any).testEmailService = testEmailService;
}
