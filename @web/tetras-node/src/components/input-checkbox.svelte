<script lang="ts">
	import { faCheck } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let name: string
</script>

<div class="flex gap-4 items-center relative">
    <input
        class="opacity-0 z-10 cursor-pointer"
        type="checkbox" 
        id={ name }
        name={ name }
    />
    <div class="absolute flex items-center justify-center">
        <div>
            <Fa 
                icon={ faCheck }
                size="1.1rem"
            />
        </div>
    </div>
    <label for={ name }>{ name }</label>
</div>

<style>
    div > input {
        width: 1.5rem;
        height: 1.5rem;
    }

    div > input + div {
        box-shadow: var(--app-shadow);
        border-radius: 0.2rem;
        width: 1.5rem;
        height: 1.5rem;
    }

    div > input:checked + div {
        box-shadow: var(--app-inner-shadow);
    }

    div > input + div > div {
        opacity: 0;
        color: white;
        transition-duration: 150ms;
    }
    
    div > input:hover + div > div {
        opacity: 0.3;
    }

    div > input:checked + div > div {
        opacity: 1;
        color: var(--card-color);
    }
</style>