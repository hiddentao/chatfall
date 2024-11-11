FROM oven/bun:latest

WORKDIR /app

COPY dist-bin/chatfall-linux-arm64 /app/chatfall

RUN chmod +x /app/chatfall

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV LOG_LEVEL=info
# ENV DATABASE_URL=
# ENV MAILGUN_API_KEY=
# ENV MAILGUN_SENDER=
# ENV ENC_KEY=

EXPOSE 3000

ENTRYPOINT ["./chatfall"]
