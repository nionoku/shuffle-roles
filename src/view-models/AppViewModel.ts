import { Component, Vue } from 'vue-property-decorator'
import { ConnectionStatus } from '@/models/ConnectionStatus'
import { Role } from '@/models/Role'
import Peer from 'peerjs'
import { ConnectionEvent } from '@/models/ConnectionEvent'
import { JsonFileReader } from '@/utils/JsonFileReader'

@Component
export default class AppViewModel extends Vue {
  protected peer: Peer | null = null
  protected connections: Peer.DataConnection[] = []
  protected dataConnection: Peer.DataConnection | null = null
  protected isHost = false
  protected isClient = false
  protected connection = {
    status: ConnectionStatus.NOT_CONNECTED
  }

  protected role: Role | null = null
  protected roles: { filename: string | null; content: Role[] } = {
    filename: null,
    content: []
  }

  protected mounted () {
    this.peer = new Peer()

    this.peer.on('connection', (peer) => {
      peer.on('open', () => {
        this.connections.push(peer)
      })

      peer.on('close', () => {
        const peerId = this.connections.findIndex(it => it.label === peer.label)
        if (peerId > -1) {
          this.connections.splice(peerId, 1)
        }
      })

      peer.on('error', (err) => {
        // TODO (2020.04.23): Add message 'Peer was disconnected'
        console.log(err)
      })
    })

    this.peer.on('error', (err) => {
      // TODO (2020.04.22): Handle error peer
      console.log(err)
    })

    this.peer.on('close', () => {
      // TODO (2020.04.22): Handle close peer
    })
  }

  protected serve () {
    this.isHost = true
    // TODO (2020.04.22): Create server and wait hosts
  }

  protected connect () {
    try {
      this.isClient = true

      const peerId = prompt('Введите идентификатор хоста', '')

      if (peerId == null || peerId === '') {
        throw new Error('Указанный идентификатор хоста недействителен')
      }

      if (this.peer && peerId) {
        const connection = this.peer.connect(peerId)

        connection.on('data', (data) => {
          try {
            const message = JSON.parse(data)

            switch (message.event) {
              case ConnectionEvent.SET_ROLE: {
                if (!message.data) {
                  throw new Error('Ошибка выдачи роли: от хоста поступило сообщение с пустой ролью')
                }

                this.role = message.data
                break
              }

              default:
                throw new Error('Неподдерживаемое событие')
            }
          } catch (err) {
            alert(err.message)
          }
        })

        connection.on('error', (err) => {
          // TODO (2020.04.23): Add alert 'Invalid connection'
          console.log(err)
        })

        connection.on('close', () => {
          location.reload()
        })
      }
    } catch (err) {
      this.isClient = false
      alert(err.message)
    }
  }

  protected takeRoles () {
    try {
      if (this.roles.content.length < this.connections.length + 1) {
        throw new Error('Количество ролей меньше, чем количество игроков')
      }

      const shuffleRoles = this.shuffle(this.roles.content)

      this.connections.forEach(it => {
        it.send(JSON.stringify({
          event: ConnectionEvent.SET_ROLE,
          data: shuffleRoles.pop()
        }))
      })

      this.role = shuffleRoles.pop() as Role
    } catch (err) {
      alert(err.message)
    }
  }

  protected shuffle (roles: Role[]): Role[] {
    return roles.slice().sort(() => 0.5 - Math.random())
  }

  protected async fillRoles (file: File) {
    try {
      if (file) {
        this.roles.filename = file.name
        this.roles.content = await JsonFileReader.readFile(file) as Array<Role>
      }
    } catch (err) {
      alert(err)
    }
  }

  protected dropHandler (event: any) {
    this.fillRoles(event.dataTransfer.files[0])
  }

  protected selectFileHandler (event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.fillRoles(event.target.files[0])
    }
  }

  protected openFileDialog () {
    const fileDialog = this.$refs.fileDialog as HTMLInputElement
    fileDialog.click()
  }

  protected get sessionId () {
    return this.peer ? this.peer.id : ''
  }

  protected get connectedUsersCount () {
    return this.connections.length
  }

  protected get userRole () {
    return this.role
  }

  protected get connectionButtonDisabled () {
    return this.connection.status !== ConnectionStatus.NOT_CONNECTED
  }

  protected get connectionButtonStatus () {
    switch (this.connection.status) {
      case ConnectionStatus.CONNECTION:
        return 'Подключение...'

      case ConnectionStatus.CONNECTED:
        return 'Подключено'

      default:
        return 'Подключиться'
    }
  }

  protected get selectedFilename () {
    return this.roles.filename ? this.roles.filename : 'Выберите файл с ролями'
  }
}
