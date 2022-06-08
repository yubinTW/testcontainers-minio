import { MinioContainer, StartedMinioContainer } from './minio-container'

describe('Minio Container Test', () => {
  let minioContainer: StartedMinioContainer

  beforeAll(async () => {
    minioContainer = await new MinioContainer()
      .withMinioRootUser('admin')
      .withMinioRootPassword('adminPassword')
      .start()
  })

  it('should return whoami result', async () => {
    const whoamiResult = await minioContainer.exec(['whoami'])

    expect(whoamiResult.exitCode).toBe(0)
    expect(whoamiResult.output.trim()).toBe('root')
  })

  it('should return minioClient instance', async () => {
    const minioClient = minioContainer.getMinioClient()
    expect(minioClient).toBeTruthy()
  })
})
