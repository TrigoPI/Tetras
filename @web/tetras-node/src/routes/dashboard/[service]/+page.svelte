<script lang="ts">
	import { AppErrors } from "@utils/errors";
    import { BuildForm } from "@utils/type-checker";
	import Routes from "@utils/routes";

    import Button from "@components/button.svelte";
	import InputCheckbox from "@components/input-checkbox.svelte";
    import InputText from "@components/input-text.svelte"
	
	import { Exception } from "exception";
	import { RestClient, type HttpResponse } from "rest-client";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { faSpinner } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let data: Record<string, any>;

    let configs: Record<string, any>[] = [];
    let waiting: boolean = false;

    const onSubmit = async (e: SubmitEvent): Promise<void> => {
        if (!e.target) return; 
        
        try {
            const formData: FormData = new FormData(<HTMLFormElement>e.target);
            const json: Record<string, any> = BuildForm(formData, configs);
            await RestClient.Post(`${Routes.API_CORE_URL}/api-core/service/configuration/save/${data.service}`, json);
            
            await goto("/dashboard");
        } catch (e: any) {
            const exception: Exception = Exception.EnsureError(e);
            
            if (exception.type == AppErrors.INVALID_TYPE) {
                console.log(exception.context);
            }
        }
    } 

    onMount(async () => {
        try {
            const res: HttpResponse = await RestClient.Get(`${Routes.API_CORE_URL}/api-core/service/configuration/${data.service}`);
            const json: Record<string, any> = res.Json<Record<string, any>>();
            for (const name in json) configs = [{ name, ...json[name] }, ...configs];
        } catch (e: any) {
            console.log(e);
        }
    });
</script>

<div class="sm:w-1/2 max-w-2xl">
    <div class="py-8 px-12 rounded-xl app-shadow">
        <h1 class="text-white font-bold text-5xl text-center">{ data.service }</h1>
    </div>
    {#if configs.length > 0}
        <form class="mt-12" on:submit|preventDefault={ (e) => onSubmit(e) }>
                {#each configs as conf}
                    {#if conf.input == "text"}    
                        <InputText 
                            name={ conf.name }
                            title={ conf.display_name }
                            placeholder={ conf.placeholder }
                            value={ conf.value }
                        />    
                    {/if}
                    {#if conf.input == "checkbox"}
                        <div class="text-white flex flex-col gap-4">
                            <h6 class="text-lg font-semibold py-1">{ conf.display_name }</h6>
                            {#each conf.checkboxes as name }
                                <InputCheckbox 
                                    name={ name }
                                    checked={ (conf.value != undefined)? conf.value.includes(name) : false }
                                />
                            {/each}
                        </div>
                    {/if}
                {/each}
                <div class="flex gap-12 justify-end py-8">
                    <Button
                        disabled={ waiting } 
                        type="submit"
                    >
                        {#if !waiting}
                            <span>Save</span>
                        {:else}
                            <Fa 
                                icon={ faSpinner }
                                spin
                            />
                        {/if}
                    </Button>

                    <a href="/dashboard">
                        <Button>
                            <span>Exit</span>
                        </Button>
                    </a>
                </div>
            </form>
        {:else}
            <div class="mt-12">
                <div class="app-shadow shadow-md rounded-md flex flex-col items-center py-12 px-4 sm:px-12">
                    <img src="https://clipart-library.com/images_k/cute-ghost-transparent/cute-ghost-transparent-7.png" alt="ghost">
                    <h1 class="text-center text-5xl font-bold text-white md:text-left">No configuration available</h1>
                </div>
            </div>
        {/if}
</div>

<style>
    img {
        width: 25rem;
    }
</style>