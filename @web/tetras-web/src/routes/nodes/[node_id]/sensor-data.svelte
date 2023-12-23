<script lang="ts">
	import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let icon: IconDefinition;
    export let title: string;
    export let value: string;
</script>


<div class="py-2 px-8 mt-10 flex flex-col items-center xs:items-start xs:border-l-2">
    <div class="flex items-center gap-4">
        <div class="text-3xl opacity-20">
            <Fa icon={ icon } />
        </div>
        <div>
            <h4 class="text-xl font-semibold">{ value }</h4>
        </div>
    </div>
    <p class="opacity-70 py-1 text-lg">{ title }</p>
</div>