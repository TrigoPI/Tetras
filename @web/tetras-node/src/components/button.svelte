<script lang="ts">
    export let type: "button" | "submit" = "button";
    export let disabled: boolean = false;
    export let onClick: () => void = () => {};
</script>

<button 
    class="app-shadow w-36 h-12 rounded-md text-white {disabled? "no-event" : ""}"
    type={ type }
    disabled={ disabled }
    on:click={ onClick }
>
    <div class="w-full h-full flex justify-center items-center">
        <slot />
    </div>
</button>

<style>
    button > div {
        opacity: 0.5;
        transition: 200ms;
    }

    button:hover > div {
        opacity: 1;
        color: var(--card-color);
    }
</style>