import formData from "form-data"
import get from "lodash.get"
import Mailgun from "mailgun.js"
import type { IMailgunClient } from "mailgun.js/Interfaces"
import { type LogInterface } from "../logger"

const mailgun = new Mailgun(formData)

export type MailerSendParams = {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export class Mailer {
  private log: LogInterface
  private fromAddress?: string
  private replyToAddress?: string
  private domain?: string
  private mailClient?: IMailgunClient

  constructor(params: {
    log: LogInterface
    apiKey?: string
    fromAddress?: string
    replyToAddress?: string
  }) {
    const { log, apiKey, fromAddress, replyToAddress } = params

    this.fromAddress = fromAddress
    this.replyToAddress = replyToAddress
    this.domain = fromAddress?.split("@")[1]
    this.log = log.create("mailer")
    if (apiKey) {
      this.mailClient = mailgun.client({
        username: "api",
        key: apiKey,
      })
    }
  }

  async send(params: MailerSendParams) {
    const { to, subject, text, html = "" } = params

    this.log.info(`Sending email to ${to} with subject: ${subject}`)

    this.log.debug(`
to: ${to}
reply-to: ${this.replyToAddress}
subject: ${subject}
text: ${text}
html: ${html}
    `)

    const attrs: any = {
      from: this.fromAddress,
      "h:Reply-To": this.replyToAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html: html || text,
    }

    try {
      if (this.mailClient && this.domain) {
        await this.mailClient.messages.create(this.domain, attrs)
      } else {
        this.log.warn(`Email not sent, mail client not initialized`)
      }
    } catch (err: any) {
      const errors = get(err, "response.body.errors", [])
      const errorsStr = errors
        .map((e: any) => `${e.field}: ${e.message}`)
        .join(`\n`)
      const errMsg = `Error sending email: ${errorsStr ? `\n${errorsStr}` : err.message}`
      throw new Error(errMsg)
    }
  }
}
