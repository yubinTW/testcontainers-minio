import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { AbstractStartedContainer } from 'testcontainers/dist/modules/abstract-started-container'
import { LogWaitStrategy } from 'testcontainers/dist/wait-strategy'
import { Client } from 'minio'

export class MinioContainer extends GenericContainer {
  private waitingLog = 'Documentation: https://docs.min.io'
  private minioRootUser = 'root'
  private minioRootPassword = 'rootPassword'

  constructor(image: string = 'minio/minio:RELEASE.2022-06-07T00-33-41Z') {
    super(image)
  }

  public withWaitingLog(log: string) {
    this.waitingLog = log
  }

  public withMinioRootUser(username: string) {
    if (username.length < 3) {
      throw new Error(`The length of MINIO_ROOT_USER should not less than 3`)
    }
    this.minioRootUser = username
    return this
  }

  public withMinioRootPassword(password: string) {
    if (password.length < 8) {
      throw new Error(`The length of MINIO_ROOT_PASSWORD should not less than 8`)
    }
    this.minioRootPassword = password
    return this
  }

  public async start(): Promise<StartedMinioContainer> {
    this.withWaitStrategy(new LogWaitStrategy(this.waitingLog))
      .withExposedPorts(9000)
      .withEnv('MINIO_ROOT_USER', this.minioRootUser)
      .withEnv('MINIO_ROOT_PASSWORD', this.minioRootPassword)
      .withCmd(['server', '/data'])
    const minioContainer = new StartedMinioContainer(await super.start(), this.minioRootUser, this.minioRootPassword)

    return minioContainer
  }
}

export class StartedMinioContainer extends AbstractStartedContainer {
  private minioClient: Client

  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly minioRootUser: string,
    private readonly minioRootPassword: string
  ) {
    super(startedTestContainer)
    this.minioClient = new Client({
      endPoint: this.getHost(),
      port: this.getMappedPort(9000),
      useSSL: false,
      accessKey: this.minioRootUser,
      secretKey: this.minioRootPassword
    })
  }

  public getMinioRootUser() {
    return this.minioRootUser
  }

  public getMinioRootPassword() {
    return this.minioRootPassword
  }

  public getMinioClient() {
    return this.minioClient
  }
}
