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
        .then(_ => { return Response.redirect(url.toString(), 302) })
        .catch(e => {
          // TODO: store errors somewhere
          console.log({
            message: e.message,
            cause: e.cause.message,
          })
          return Response.redirect(url.toString(), 302)
        })
    })

  } else {
    return new Error("Method not allowed")
  }
}