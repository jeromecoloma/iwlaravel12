<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: 600;
            color: #555;
            margin-bottom: 5px;
            display: block;
        }
        .field-value {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e9ecef;
            font-size: 14px;
        }
        .message-field {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #6c757d;
            font-size: 12px;
        }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border-left: 4px solid #007bff;
        }
        .metadata-title {
            font-weight: 600;
            color: #495057;
            margin-bottom: 10px;
        }
        .metadata-item {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">iwlaravel12 Website</p>
        </div>

        <div class="content">
            <p>You have received a new message through the contact form on your website.</p>

            <div class="field">
                <span class="field-label">Name:</span>
                <div class="field-value">{{ $contactName }}</div>
            </div>

            <div class="field">
                <span class="field-label">Email:</span>
                <div class="field-value">{{ $contactEmail }}</div>
            </div>

            <div class="field">
                <span class="field-label">Subject:</span>
                <div class="field-value">{{ $contactSubject }}</div>
            </div>

            <div class="field">
                <span class="field-label">Message:</span>
                <div class="field-value message-field">{{ $contactMessage }}</div>
            </div>

            @if(!empty($metadata))
            <div class="metadata">
                <div class="metadata-title">📊 Submission Details</div>
                @foreach($metadata as $key => $value)
                <div class="metadata-item">
                    <strong>{{ ucfirst(str_replace('_', ' ', $key)) }}:</strong> {{ $value }}
                </div>
                @endforeach
            </div>
            @endif
        </div>

        <div class="footer">
            <p>This email was sent from the contact form on your iwlaravel12 website.</p>
            <p>To reply to this message, simply respond to this email.</p>
        </div>
    </div>
</body>
</html>