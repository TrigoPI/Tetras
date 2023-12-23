<script lang="ts">
    export let title: string;
    export let name: string;
    export let placeholder: string;
    export let value: string | undefined = undefined;
</script>

<div class="my-4">
    <p class="font-bold text-lg text-white py-1">{ title }</p>
    <div class="rounded-md app-inner-shadow px-4 py-2">
        <input
            placeholder={ placeholder }
            name={ name }
            value={ (value == undefined)? "" : value }
            class="bg-transparent text-white w-full focus:outline-none placeholder:opacity-30 py-2" 
            type="text"
        >
        <div class="input-highlight bg-yellow-300"></div>
    </div>
</div>

<style>
    .input-highlight {
        width: 0;
        height: 1px;
        transition-duration: 300ms;
    }

    input:focus + div {
        width: 100%;
    }

</style>