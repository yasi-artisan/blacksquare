import { ActionError } from "astro/actions/runtime/virtual/shared.js";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      message: z.string().min(8),
      name: z.string().optional(),
    }),
    handler: async ({ email, message, name }) => {
      const { data, error } = await resend.emails.send({
        from: "Yasaman Moussavi -- Official webpage <no-reply@yasamanmoussavi.com>",
        to: [email],
        bcc: ["kavehrafie@gmail.com"],
        subject: "Thank you for your message",
        text: message,
        html: `
                <p>Thanks ${name && ", " + name}! Your message was received!</p>
                <p>Here is the content of your message:</p>
                <blockquote>${message}</blockquote>`,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return {
        success: true,
        message: "🎉 Got it. Thank you for your message!",
      };
    },
  }),
};
