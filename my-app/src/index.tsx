import { Button, Html, Tailwind } from "@react-email/components";
import { render } from "@react-email/render";
import { Hono } from "hono";
import { cors } from "hono/cors";

const nodemailer = require("nodemailer");

const app = new Hono();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const TailwindWrapper = ({ children }: { children?: any }) => {
  return <Tailwind>{children} </Tailwind>;
};

const Table = ({ data }: { data: any }) => {
  const arrayOfKeyValuePairs = [];

  Object.keys(data).forEach((key, i) => {
    if (!key.startsWith("_"))
      arrayOfKeyValuePairs.push({ key, value: data[key] });
  });

  return (
    <TailwindWrapper>
      {arrayOfKeyValuePairs.map((item, i) => (
        <div>
          {item.key}: {item.value}
        </div>
      ))}
    </TailwindWrapper>
  );
};

// app.use(
//   "/*",
//   cors({
//     origin: ["https://example.com", "https://example.org"],
//     allowMethods: ["GET", "POST", "PUT", "DELETE"],
//     allowHeaders: ["Content-Type"],
//   }),
// );

app.post("/:sendToEmail", async (c) => {
  const sendToEmail = c.req.param("sendToEmail");

  const body =
    c.req.header("Content-Type") === "application/json"
      ? await c.req.json()
      : await c.req.parseBody();

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: sendToEmail,
    subject: body._subject || "untitled",
    html: render(<Table data={body} />),
  };
  await transporter.sendMail(mailOptions);

  return c.text("success!");
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
