<template>
  <div class="container">
    <!-- For player -->
    <div
      class="container"
      :class="{ 'user': isClient, 'host': isHost }"
    >
      <div
        class="item"
        v-show="isHost"
      >
        <span>Идентификатор сессии: {{ sessionId }}</span>
        <span>Подключено пользователей: {{ connectedUsersCount }}</span>
      </div>
      <div class="item">
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
          >Создать сервер</button>
          <button
            v-if="isHost"
            @click="shuffleAndTakeRoles"
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
        class="item"
        v-show="isHost"
      >
        Выберите файл
        <!-- Files selector -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
    > div:nth-child(2) {
      flex: 0.5;
    }

    > div:nth-child(3) {
      flex: 1;
    }
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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
  }
}
</style>

<script lang="ts" src="@/view-models/AppViewModel"></script>
