exports.handler = function (event, context, callback) {
  // your server-side functionality


  // get GitHub secret etc

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true
    })
  }
}
