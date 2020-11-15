export default function makeGetArticles ({ listArticles }) {
  if (typeof listArticles !== 'function') {
    throw new Error('makeGetArticles requires listArticles')
  }
  return async function getArticles ({ query }) {
    try {
      const data = await listArticles({ query })

      return {
        statusCode: 200,
        data
      }
    } catch (e) {
      console.log(e)
      return {
        statusCode: 400,
        data: {
          message: e.message
        }
      }
    }
  }
}
