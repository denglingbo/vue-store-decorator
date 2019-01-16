<template>
  <div>
    <h1>Hi Demo</h1>
    <div>info: {{ info }}</div>
    <div>error: {{ errors }}</div>
    <div>loadings: {{ loadings }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State, Getter } from 'vuex-class';

@Component
export default class DemoStore extends Vue {
  @Getter('sotreDecorator/errors') private errors: any;
  @Getter('sotreDecorator/loadings') private loadings: any;
  @Getter('sotreDecorator/info') private info: any;
  @Action('sotreDecorator/fetch') private fetch: any;
  @Action('sotreDecorator/testError') private testError: any;

  private mounted() {
    this.fetch();
    this.testError();
  }
}
</script>

