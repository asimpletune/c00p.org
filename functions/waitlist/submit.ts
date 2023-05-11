export function onRequest(context) {
  if (context.request.method === "POST") {
    const fd = context.request.formData()
    return fd.then(fd => {
      const entries = Object.fromEntries(fd)
      return new Response(`${entries.name}, ${entries.email}, ${entries.message}`)
    })
  } else {
    return new Error("Method not allowed")
  }
}