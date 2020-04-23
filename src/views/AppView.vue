<template>
  <div class="container flex-center">
    <div
      class="container flex-center"
      :class="{ 'user': isClient, 'host': isHost }"
    >
      <div
        class="item flex-center"
        v-show="isHost"
      >
        <span>Идентификатор сессии: {{ sessionId }}</span>
        <span>Подключено пользователей: {{ connectedUsersCount }}</span>
      </div>
      <div class="item flex-center">
        <div class="role">
          <span>Ваша роль</span>
          <div class="image-role-container">
            <img
              v-if="userRole"
              class="image-role"
              :src="userRole.link"
              :title="userRole.name"
              :alt="userRole.name"
            >
            <span v-else>[ Роль не выдана ]</span>
          </div>

        </div>
        <div class="buttons">
          <button
            v-if="!isClient"
            @click="serve"
            :disabled="isHost"
          >Создать сервер</button>
          <button
            v-if="isHost"
            @click="takeRoles"
          >Выдать роли</button>
          <button
            v-if="!isHost"
            :disabled="connectionButtonDisabled"
            v-text="connectionButtonStatus"
            @click="connect"
          />
        </div>
      </div>
      <div
        class="item flex-center"
        v-show="isHost"
      >
        <div class="drop-zone flex-center">
          <span class="filename">{{ selectedFilename }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: auto;

  &.user {
    > div:nth-child(1),
    > div:nth-child(3) {
      flex: 0.5;
    }

    > div:nth-child(2) {
      flex: 1;
    }
  }

  &.host {
    > div:nth-child(1),
    > div:nth-child(3) {
      flex: 0.5;
    }

    > div:nth-child(2) {
      flex: 1;
    }
  }

  .item {
    width: 100%;

    .logo {
      height: 12vh;
    }

    .role {
      width: 100%;
      margin: 0 0 var(--block-margin-default);
      text-align: center;

      .image-role-container {
        margin: 10px 0;

        .image-role {
          display: block;
          margin: auto;
          max-height: 45vh;
          max-width: 80%;

          background: var(--role-image-background);
          border-radius: 7px;
          object-fit: contain;
        }
      }
    }

    .buttons {
      margin: 0 0 var(--block-margin-default);

      button {
        margin: 0 5px;
      }
    }

    .drop-zone {
      width: 90%;
      height: 100%;
      margin: 10px 0;
      border: 2px dashed #a1a1a1;
      border-radius: 20px;
    }
  }
}
</style>

<script lang="ts" src="@/view-models/AppViewModel"></script>
