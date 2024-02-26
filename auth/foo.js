const nt = require('nostr-tools')

// this is njs file to handle requests inside of nginx
// It validates body of requests
// - clone has only want <hash> {N times} done 
// - pull same as clone but with have <hash> before done
// - push will have hex encoded blobs
//

function main(r) {
  console.log('----------------')
  console.log(r.method)
  console.log(r.uri)
  console.log(r.requestText)
  console.log(r.headersIn)
  console.log('----------------')

  console.error('================')
  console.error(r.method)
  console.error(r.uri)
  console.error(r.requestText)
  console.error(r.headersIn)
  console.error('===============')
  return

  if (r.method === 'GET') {
    // forward to github
    return
  }

  if (r.method !== 'POST') {
    r.return(405, 'Method Not Allowed')
    return
  }

  bodyString = r.requestText
  authHeader = r.headersIn['X-Authorization']
  if (authHeader) {
    // method push (on both get and post requests)
    // payload commit (on both get and post requests)
    const isValid = isValidateAuthHeader(authHeader, r.uri, r.method)
    if (!isValid) {
      r.return(403, 'Forbidden')
      return
    }
  }

  // const isAuth = shouldBeAuthenticated(bodyString)
  // if (!isAuth) {
  //   nt.finalizeEvent(403, 'Forbidden')
  // }
  // nt.finalizeEvent(200, 'OK')
}

function isValidateAuthHeader(authHeader, url, method) {
  try {
    const isValid = nt.nip98.validateToken(authHeader, url, method)
    return true
  } catch (e) {
    return false
  }
}

function shouldBeAuthenticated(bodyString) {
  if (!bodyString) return true

  // definitely push
  if (hasPack(bodyString)) return true

  // definitely pull
  if (hasHave(haveString)) return true

  if (isDone(bodyString)) {
    // definitely clone
    if (hasWant(bodyString)) return false
  } else {
    // nothing is deffinite here
  }
}

function isDone(bodyString) {
  return bodyString.includes('done')
}

function hasPack(bodyString) {
  return bodyString.includes('PACK')
}

function isPull(bodyString) {
  return hasHave(bodyString)
}

function hasHave(bodyString) {
  return bodyString.includes('have')
}

function hasWant(bodyString) {
  return bodyString.includes('want')
}

export default { main }
