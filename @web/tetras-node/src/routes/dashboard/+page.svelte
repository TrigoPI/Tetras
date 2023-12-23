<script lang="ts">
	import { onMount } from "svelte";
    import { HttpResponse, RestClient } from "rest-client"
    	
    import ServiceCard from "./service-card.svelte";
	import ServiceAdd from "./service-add.svelte";
	import Routes from "@utils/routes";

    let services: any[] = [];

    onMount(async () => {
        try {
            const res: HttpResponse = await RestClient.Get(`${Routes.API_CORE_URL}/api-core/service/names`);
            services = res.Json();
        } catch (e: any) {
            console.log(e);
        }
    });
</script>

<div class="app-shadow py-8 px-12 rounded-xl">
    <h1 class="text-white font-bold text-5xl">Services</h1>
</div>
<div class="flex gap-8 flex-wrap justify-center w-full">
    {#each services as service}
        <ServiceCard 
            name={ service.name }
            base_path={ service.base_path }
            status={ service.status }
            ip={ service.ip }
            port={ service.port }
        />
    {/each}
    <ServiceAdd />
</div>