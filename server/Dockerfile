FROM oven/bun:latest

ARG TARGETPLATFORM

WORKDIR /app

RUN echo "I'm building for $TARGETPLATFORM"

# Set the default value for MY_ARG
ENV TARGETPLATFORM=${TARGETPLATFORM}

COPY dist-bin/chatfall-* /app

# only want the binary for the current platform
RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then \
      cp /app/chatfall-linux-x64 /app/chatfall; \
    else \
      cp /app/chatfall-linux-arm64 /app/chatfall; \
    fi
RUN rm -rf /app/chatfall-*

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
