export function onRequest(context) {
  let { searchParams } = new URL(context.request.url)
  let lang = searchParams.get('lang')
  if (['en', 'it'].includes(lang)) {
    let host = (new URL(context.request.url)).host
    let redirect_url = `https://${host}${searchParams.get('redirect')}`
    let language_pref_cookie = `preferred-language=${lang}; HttpOnly; SameSite=Strict; Max-Age=2592000`
    const response = Response.redirect(redirect_url, 302)
    response.headers.set("Set-Cookie", language_pref_cookie)
    return response
  } else {
    return new Response("Language not supported", { status: 400 })
  }
}