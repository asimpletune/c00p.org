interface Env {
  COOP_DB: D1Database;
}

// TODO: add more metadata columns to waitlist table to track/block spammers
export function onRequest(context) {
  if (context.request.method === "POST") {
    const fd = context.request.formData()
    return fd.then(fd => {
      const entries = Object.fromEntries(fd)
      const ps = context.env.COOP_DB
        .prepare('INSERT INTO waitlist (name, email, message) VALUES (?1, ?2, ?3)')
      let stmt = ps.bind(entries.name, entries.email, entries.message)
      return stmt.run()
        .then(db_rep => new Response(`Inserted: "${entries.name}", "${entries.email}", "${entries.message}", \nwith result: "${JSON.stringify(db_rep)}"`))
        .catch(e => {
          console.log({
            message: e.message,
            cause: e.cause.message,
          })
          // TODO: store errors somewhere

          return new Response(`Error: ${e.message}\n${e.cause.message}`)
        })
    })

  } else {
    return new Error("Method not allowed")
  }
}