# Chatfall Server Environment Configuration

The Chatfall server requires certain environment variables to be set for proper operation. This guide details all the configuration options, including mandatory and optional variables.

## Mandatory Environment Variables

- **PORT**: The port number on which the server will listen.

  ```env
  PORT=3000
  ```

- **DATABASE_URL**: The connection string for your PostgreSQL database.

  ```env
  DATABASE_URL=postgres://user:password@localhost:5432/chatfall
  ```

- **JWT_SECRET**: A secret key used for signing JSON Web Tokens.

  ```env
  JWT_SECRET=your-secure-jwt-secret
  ```

- **EMAIL_SMTP_HOST**: SMTP host for email verification.

  ```env
  EMAIL_SMTP_HOST=smtp.your-email-provider.com
  ```

- **EMAIL_SMTP_PORT**: SMTP port (usually 587 for TLS).

  ```env
  EMAIL_SMTP_PORT=587
  ```

- **EMAIL_SMTP_USER**: SMTP username for authentication.

  ```env
  EMAIL_SMTP_USER=your-email@your-domain.com
  ```

- **EMAIL_SMTP_PASSWORD**: SMTP password for authentication.

  ```env
  EMAIL_SMTP_PASSWORD=your-email-password
  ```

- **EMAIL_FROM_ADDRESS**: The email address from which verification emails will be sent.

  ```env
  EMAIL_FROM_ADDRESS=no-reply@your-domain.com
  ```

## Optional Environment Variables

- **LOG_LEVEL**: The logging level for the server (`info`, `warn`, `error`, `debug`). Default is `info`.

  ```env
  LOG_LEVEL=debug
  ```

- **CORS_ORIGIN**: Configures Cross-Origin Resource Sharing. Set this to your client URL to allow cross-origin requests.

  ```env
  CORS_ORIGIN=https://your-website.com
  ```

- **RATE_LIMIT_WINDOW_MS**: Time frame for rate limiting in milliseconds. Default is `60000` (1 minute).

  ```env
  RATE_LIMIT_WINDOW_MS=60000
  ```

- **RATE_LIMIT_MAX**: Maximum number of requests within the rate limit window. Default is `100`.

  ```env
  RATE_LIMIT_MAX=100
  ```

## Sample `.env` File

Create a `.env` file in your `server` directory and populate it with your configuration:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/chatfall
JWT_SECRET=your-secure-jwt-secret
EMAIL_SMTP_HOST=smtp.your-email-provider.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@your-domain.com
EMAIL_SMTP_PASSWORD=your-email-password
EMAIL_FROM_ADDRESS=no-reply@your-domain.com
LOG_LEVEL=info
CORS_ORIGIN=https://your-website.com
```

## Applying Configuration

The server reads environment variables at startup. Ensure that you have set all mandatory variables before running the server.

## Security Considerations

- **JWT_SECRET**: Keep this value secure. Do not expose it publicly.
- **Database Credentials**: Protect your database connection string.
- **SMTP Credentials**: Secure your email SMTP credentials.

## Troubleshooting

- **Missing Environment Variables**: The server will not start if mandatory variables are not set.
- **Invalid Database URL**: Ensure the `DATABASE_URL` is correct and the database is accessible.
- **Email Issues**: If email verification is not working, check your SMTP settings.
