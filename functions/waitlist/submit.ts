interface Env {
  COOP_DB: D1Database;
}

export function onRequest(context) {
  if (context.request.method === "POST") {
    const fd = context.request.formData()
    return fd.then(fd => {
      const entries = Object.fromEntries(fd)
      const ps = context.env.COOP_DB
        .prepare('INSERT INTO waitlist (name, email, message) VALUES (?1, ?2, ?3)')
      const result = ps.bind(entries.name, entries.email, entries.message).run()
      return result.then(db_rep => new Response(`${db_rep}`))
    })
  } else {
    return new Error("Method not allowed")
  }
}