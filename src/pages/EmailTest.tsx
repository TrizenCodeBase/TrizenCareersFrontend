import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { emailService } from "@/services/emailService";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState("support@trizenventures.com");
  const [testName, setTestName] = useState("Test User");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const testEmailService = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing email service...');
      
      // Test 1: Health Check
      console.log('1. Testing health check...');
      const isHealthy = await emailService.checkHealth();
      console.log('Health check result:', isHealthy);
      
      // Test 2: Configuration Test
      console.log('2. Testing configuration...');
      const configResult = await emailService.testConfiguration();
      console.log('Configuration test result:', configResult);
      
      // Test 3: Send Test Email
      console.log('3. Sending test email...');
      const token = localStorage.getItem('token') || '';
      const emailResult = await emailService.sendJobApplicationConfirmation({
        applicantName: testName,
        applicantEmail: testEmail,
        jobTitle: 'Test Job Position',
        jobId: 'TEST-001',
        companyName: 'Trizen Ventures'
      }, token);
      
      console.log('Email test result:', emailResult);
      
      setResult({
        success: emailResult.success,
        message: emailResult.message,
        data: emailResult.data
      });
      
    } catch (error) {
      console.error('Test failed:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Service Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address to test"
                />
              </div>
              
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Enter name for test"
                />
              </div>
            </div>

            <Button 
              onClick={testEmailService}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Email Service...
                </>
              ) : (
                "Test Email Service"
              )}
            </Button>

            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  <div className="font-semibold mb-2">
                    {result.success ? "✅ Test Successful!" : "❌ Test Failed"}
                  </div>
                  <div className="text-sm">
                    <strong>Message:</strong> {result.message}
                  </div>
                  {result.data && (
                    <div className="text-sm mt-2">
                      <strong>Data:</strong> {JSON.stringify(result.data, null, 2)}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Enter a valid email address (not test@example.com)</li>
                <li>Click "Test Email Service"</li>
                <li>Check the browser console for detailed logs</li>
                <li>Check the email inbox for the test email</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTest;
