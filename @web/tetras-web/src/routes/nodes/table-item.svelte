<script>
	import { faEye } from "@fortawesome/free-regular-svg-icons";
	import Fa from "svelte-fa";

</script>
<div class="flex break-all py-2 border-b gap-3">
    <span class="flex-1">aa-bb-cc-dd</span>
    <span class="flex-1">43.1473934, 1.3597004</span>
    <span class="flex-1 hidden sm:block">100%</span>
    <span class="flex-1 hidden sm:block">10/11/23 24/11/23 10:15:20</span>
    <a href="/nodes/aa-bb-cc-dd" class="flex-1 flex items-center justify-center opacity-20 text-2xl">
        <Fa icon={ faEye } />
    </a>
</div>