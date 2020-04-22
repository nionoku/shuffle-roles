import { Component, Vue } from 'vue-property-decorator'
import { ConnectionStatus } from '@/models/ConnectionStatus'
import { Role } from '@/models/Role'
import Peer from 'peerjs'
import { ConnectionEvent } from '@/models/ConnectionEvent'

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
  protected roles: Role[] = []

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
      if (this.roles.length < this.connections.length + 1) {
        throw new Error('Количество ролей меньше, чем количество игроков')
      }

      const copyRoles = this.roles.slice()
      copyRoles.sort(() => 0.5 - Math.random())

      this.connections.forEach(it => {
        it.send(JSON.stringify({
          event: ConnectionEvent.SET_ROLE,
          data: copyRoles.pop()
        }))
      })

      this.role = copyRoles.pop() as Role
    } catch (err) {
      alert(err.message)
    }
  }

  protected fillRoles () {
    // TODO (2020.04.23): Fill roles list
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
}
