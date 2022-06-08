# Testcontainers-Minio

A testcontainers for Minio

https://www.npmjs.com/package/testcontainers-minio

Integrate testcontainers of minio and [minio-js](https://github.com/minio/minio-js)

## Usage

```typescript
describe('Some tests using minio', () => {
  let minioContainer: StartedMinioContainer

  beforeAll(async () => {
    // start a minio container
    minioContainer = await new MinioContainer()
      .withMinioRootUser('admin')
      .withMinioRootPassword('adminPassword')
      .start()
  })

  afterEach(async () => {
    // you can use .getMinioClient() to get minio.Client instance
    const minioClient = minioContainer.getMinioClient()
    // remove 'bucket01' for example
    await minioClient.removeBucket('bucket01')
  })

    // test cases ...
})
```