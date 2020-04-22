import { Component, Vue } from 'vue-property-decorator'
import { ConnectionStatus } from '@/models/ConnectionStatus'
import Peer from 'peerjs'
import { Role } from '@/models/Role'

@Component
export default class AppViewModel extends Vue {
  protected peer: Peer | null = null
  protected connections = new Map<string, Peer.DataConnection>()
  protected dataConnection: Peer.DataConnection | null = null
  protected isHost = false
  protected isClient = false
  protected connection = {
    status: ConnectionStatus.NOT_CONNECTED
  }

  protected role: Role | null = null
  // {
  //   name: 'Агент',
  //   link: 'https://sun9-15.userapi.com/_Tx6yKMfGeIrkfDEthBYyk7u1Wb-8tZCUgfaYA/wpZSPKj9ZVk.jpg'
  // }

  protected roles: Role[] | null = null

  protected mounted () {
    this.peer = new Peer()

    this.peer.on('connection', (peer) => {
      setInterval(() => {
        peer.send('Hello')
      }, 500)

      peer.on('open', () => {
        this.connections.set(peer.label, peer)
        // TODO (2020.04.22): Inc clients count (or in 'connection' callback)
      })

      peer.on('close', () => {
        this.connections.delete(peer.label)
        // TODO (2020.04.22): Dec clients count
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
    this.isClient = true

    const peerId = prompt('Введите идентификатор пира', '')

    if (peerId == null || peerId === '') {
      this.isClient = false
      // TODO (2020.04.22): throw error
    }

    if (this.peer && peerId) {
      const connection = this.peer.connect(peerId)

      connection.on('data', (data) => {
        console.log(data)
      })
    }
  }

  protected shuffleAndTakeRoles () {
    // TODO (2020.04.22): Shuffle and take roles
  }

  protected get sessionId () {
    return this.peer ? this.peer.id : ''
  }

  protected get connectedUsersCount () {
    return this.connections.size
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
