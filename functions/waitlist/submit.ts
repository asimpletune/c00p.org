interface Env {
  COOP_DB: D1Database;
}

export function onRequest(context) {
  if (context.request.method === "POST") {
    const url = new URL(context.request.url)
    url.pathname = "thanks"
    const fd = context.request.formData()
    return fd.then(fd => {
      const entries = Object.fromEntries(fd)
      let cf = context.request.cf
      let cfRay = context.request.headers.get('cf-ray')
      let xRealIp = context.request.headers.get('x-real-ip')
      let ts = Date.now()
      const ps = context.env.COOP_DB
        .prepare('INSERT INTO waitlist'
          + '(name, email, message, ts, cf_ray, x_real_ip, cf_continent, cf_country, cf_city, is_eu, bot_mgmt_score, cf_json)'
          + 'VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)')
      let stmt = ps.bind(entries.name, entries.email, entries.message, ts, cfRay, xRealIp, cf.continent, cf.country, cf.city, cf.isEUCountry, cf.botManagement.score, JSON.stringify(cf))
      return stmt.run()
        .then(dbRep => sendEmail(entries.name, entries.email, entries.message, cfRay, dbRep))
        .then(_ => Response.redirect(url.toString(), 302))
        .catch(e => {
          console.log({
            message: e.message,
            cause: e.cause.message,
          })
          const emailRep = sendEmail(entries.name, entries.email, entries.message, cfRay, {
            message: e.message,
            cause: e.cause.message,
          })
          const ps = context.env.COOP_DB
            .prepare('INSERT INTO waitlist_error'
              + '(name, email, message, ts, cf_ray, e_msg, e_cause_msg, bot_mgmt_score, cf_json)'
              + 'VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)')
          let stmt = ps.bind(entries.name, entries.email, entries.message, ts, cfRay, e.message, e.cause.message, cf.botManagement.score, JSON.stringify(cf))
          let err_db_rep = stmt.run().catch(e => console.log({ message: e.message, cause: e.cause.message }))
          return Promise.allSettled([err_db_rep, emailRep]).then(_ => Response.redirect(url.toString(), 302))
        })
    })

  } else {
    return new Error("Method not allowed")
  }
}

function sendEmail(name, email, message, cfRay, dbRep) {
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
        "name": "The c00p.org waitlist",
      },
      "subject": `A new c00p.org waitlist signup ${dbRep.success ? 'succeeded' : 'failed'}`,
      "content": [{
        "type": "text/plain",
        "value": `Hi Spence, \n\nYou got a new signup for c00p.org!\n\n* name: ${name} \n* email: ${email} \n* wrote: ${message}\n\nthe DB response was:\n${JSON.stringify(dbRep)}\n\ncf-ray: ${cfRay}\n\nSincerely,\n\n- The c00p.org waitlist 🐸 🎉`
      }],
    }),
  })
  return fetch(emailRequest)
}