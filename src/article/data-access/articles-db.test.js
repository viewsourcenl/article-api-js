import makeArticlesDb from './articles-db.js'
import makeTestDb from '../../../__tests__/fixtures/db.js'
import buildFakeArticle from '../../../__tests__/fixtures/article.js'

const COLLECTION_NAME = 'articles'
const dbSize = 50

describe('articlesdb', () => {
  let crea
  let testDb
  let articlesDb
  let articles
  let collection

  beforeEach(async () => {
    jest.clearAllMocks().resetModules()

    articles = Array.from({ length: dbSize }, buildFakeArticle)

    testDb = await makeTestDb({ dbName: 'articles-db-test' })
    crea = {
      makeDb: testDb.makeDb
    }

    articlesDb = makeArticlesDb(crea)

    const db = await testDb.makeDb()

    await testDb.clear(COLLECTION_NAME)

    collection = db.collection(COLLECTION_NAME)

    const copy = articles.map(a => ({ ...a }))
    await collection.insertMany(copy)
  })

  test('make requires input', () => {
    expect(() => makeArticlesDb()).toThrow()
  })

  test.each([
    'makeDb'
  ])('make requires function %s', dep => {
    const err = `makeArticlesDb requires function ${dep}`

    expect(() => makeArticlesDb({ ...crea, [dep]: undefined })).toThrow(err)
  })

  describe('function find', () => {
    it('should return all articles', async () => {
      const result = await articlesDb.find()

      expect(result.length).toEqual(dbSize)
      expect(result).toEqual(articles)
    })
  })
})
