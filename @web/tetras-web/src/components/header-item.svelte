<script lang="ts">
    export let text: string;
    export let href: string;
    export let onClick: () => void;
</script>

<li>
    <a href={ href } on:click={ () => onClick() }>{ text }</a>
</li>