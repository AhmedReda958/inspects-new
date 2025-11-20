// Try to load dotenv if available (for standalone testing)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, but that's okay if env vars are set another way
  console.log('Note: dotenv not found. Make sure environment variables are set.');
}

const nodemailer = require('nodemailer');

async function testSMTP() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

  console.log('Testing SMTP Connection...');
  console.log('Host:', smtpHost);
  console.log('Port:', smtpPort);
  console.log('User:', smtpUser);
  console.log('From:', smtpFrom);
  console.log('To:', adminEmail);
  console.log('---');

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.error('❌ SMTP configuration is missing!');
    console.error('Please check your .env file for:');
    console.error('  - SMTP_HOST');
    console.error('  - SMTP_PORT');
    console.error('  - SMTP_USER');
    console.error('  - SMTP_PASSWORD');
    process.exit(1);
  }

  const port = parseInt(smtpPort, 10);
  const isSecure = port === 465;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: isSecure,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 10000,
  });

  try {
    // Test 1: Verify connection
    console.log('1. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Test 2: Send test email
    console.log('\n2. Sending test email...');
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: 'SMTP Test - Inspectex',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a <strong>test email</strong> to verify SMTP configuration.</p>',
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n✅ All tests passed! SMTP is configured correctly.');
  } catch (error) {
    console.error('\n❌ SMTP test failed:');
    
    if (error.code === 'ETIMEDOUT') {
      console.error('   Connection timeout - Check if the server is reachable');
      console.error('   Try: telnet', smtpHost, smtpPort);
      console.error('   Or: Test-NetConnection -ComputerName', smtpHost, '-Port', smtpPort);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused - Check host and port');
      console.error('   Verify SMTP_HOST and SMTP_PORT are correct');
    } else if (error.code === 'EAUTH') {
      console.error('   Authentication failed - Check username and password');
      console.error('   Verify SMTP_USER and SMTP_PASSWORD are correct');
    } else if (error.code === 'EENVELOPE') {
      console.error('   Envelope error - Check email addresses');
    } else {
      console.error('   Error:', error.message);
      console.error('   Code:', error.code);
    }
    
    console.error('\nFull error details:');
    console.error(error);
    process.exit(1);
  }
}

testSMTP();

