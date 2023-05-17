interface Env {
  COOP_DB: D1Database;
}

// TODO: add more metadata columns to waitlist table to track/block spammers
export function onRequest(context) {
  if (context.request.method === "POST") {
    const url = new URL(context.request.url)
    url.pathname = "thanks"
    const fd = context.request.formData()
    return fd.then(fd => {
      const entries = Object.fromEntries(fd)
      const ps = context.env.COOP_DB
        .prepare('INSERT INTO waitlist (name, email, message) VALUES (?1, ?2, ?3)')
      let stmt = ps.bind(entries.name, entries.email, entries.message)
      return stmt.run()
        .then(dbRep => sendEmail(entries.name, entries.email, entries.message, dbRep))
        .then(_ => Response.redirect(url.toString(), 302))
        .catch(e => {
          // TODO: store errors somewhere
          console.log({
            message: e.message,
            cause: e.cause.message,
          })
          return sendEmail(entries.name, entries.email, entries.message, {
            message: e.message,
            cause: e.cause.message,
          })
            .then(_ => Response.redirect(url.toString(), 302))
        })
    })

  } else {
    return new Error("Method not allowed")
  }
}

function sendEmail(name, email, message, dbRep) {
  let emailRequest = new Request("https://api.mailchannels.net/tx/v1/send", {
    "method": "POST",
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify({
      "personalizations": [
        {
          "to": [{
            "email": "spence@c00p.org",
            "name": "Spencer Scorcelletti",
          }]
        }
      ],
      "from": {
        "email": "waitlist@c00p.org",
        "name": "c00p.org waitlist",
      },
      "subject": `Waitlist signup a ${dbRep.success ? 'success' : 'failure'}`,
      "content": [{
        "type": "text/plain",
        "value":
          `Hi Spence,

          You got a new signup for c00p.org!

          * ${name} from
          * ${email}
          * wrote: ${message}

          the DB response was:
          ${JSON.stringify(dbRep)}`
      }],
    }),
  })
  return fetch(emailRequest)
}