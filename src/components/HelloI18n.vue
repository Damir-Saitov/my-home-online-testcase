<template>
<p>{{ $t('hello') }}</p>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class HelloI18n extends Vue {
}
</script>
