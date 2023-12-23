<script lang="ts">
    export let title: string;
    export let type: "button" | "submit" = "button"
</script>

<button 
    class="app-shadow w-36 h-12 rounded-md text-white"
    type={ type }
>
    <p>{ title }</p>
</button>

<style>
    button > p {
        opacity: 0.5;
        transition: 200ms;
    }

    button:hover > p {
        opacity: 1;
        color: var(--card-color);
    }
</style>