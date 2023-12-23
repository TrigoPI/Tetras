<script lang="ts">
	import Fa from "svelte-fa";
    import { faRoute, faGlobe, faHashtag, faEllipsisV, faGear, faPowerOff, faArrowRotateBack, faSpinner } from "@fortawesome/free-solid-svg-icons"

	import { RestClient } from "rest-client";
	import Routes from "@utils/routes";

    export let name: string;
    export let base_path: string;
    export let status: string;
    export let ip: string;
    export let port: number;

    let menuOpen: boolean = false;
    let loading: boolean = false;

    const serviceAction = async (action: 'start' | 'stop' | 'reload'): Promise<void> => {
        try {
            loading = true;
            await RestClient.Post(`${Routes.API_CORE_URL}/api-core/service/${action}/${name}`);
            loading = false;
            
            if (action == "start") status = "running";
            if (action == "stop")  status = "stopped";
            if (action == "reload")  status = "stopped";

        } catch (e: any) {
            loading = false;
            console.log(e);
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    class="card overflow-hidden flex flex-col bg-yellow-300 relative rounded-3xl shadow-md duration-150 hover:scale-105 w-full h-64 sm:w-96"
    on:mouseleave={ () => menuOpen = false }
>
    <div class="title absolute w-full flex justify-center items-center">
        <div class="px-2">
            {#if status == "running"}
                <div 
                    class="w-3 h-3 rounded-full" 
                    style="background-color: #6ab04c;"
                />
            {/if}
            {#if status == "stopped"}
                <div 
                    class="w-3 h-3 rounded-full" 
                    style="background-color: #eb4d4b;"
                />
            {/if}
        </div>
        <h1 class="text-center font-bold text-3xl">{ name }</h1>
    </div>
    <div class="flex-1" />
    <ul class="w-full font-semibold flex flex-wrap gap-4 justify-around px-4">
        <li>
            <Fa icon={ faRoute } size="1.5rem" />
            <p>{ base_path }</p>
        </li>
        <li>
            <Fa icon={ faGlobe } size="1.5rem" />
            <p>{ ip }</p>
        </li>
        <li>
            <Fa icon={ faHashtag } size="1.5rem" />
            <p>{ port }</p>
        </li>
    </ul>
    <div class="menu-icon flex-1 flex justify-end items-end">
        <div class="p-6">
            <button 
                class="cursor-pointer opacity-50 duration-150 hover:scale-110 hover:opacity-100"
                on:click={ () => menuOpen = true }
            >
                <Fa 
                    icon={ faEllipsisV }
                    size="1.5rem"
                />
            </button>
        </div>
    </div>
    <div 
        class="menu flex items-center justify-center shadow-md rounded-3xl absolute bg-yellow-300"
        style={menuOpen? "height: 100%" : ""}
    >
        {#if !loading}
            <ul class="flex flex-wrap gap-4 justify-around w-full font-bold">
                {#if status == "running"}    
                    <li>
                        <button class="duration-100 hover:scale-110">
                            <a 
                                class="flex" 
                                href="/dashboard/{name}"
                            >
                                <Fa icon={ faGear } size="1.5rem" />
                                <p class="px-2">Configuration</p>
                            </a>
                        </button>
                    </li>
                {/if}
                <li>
                    <button
                        class="flex duration-100 hover:scale-110"
                        on:click={ () => serviceAction('reload') }
                    >
                        <Fa icon={ faArrowRotateBack } size="1.5rem" />
                        <p class="px-2">Reload</p>
                    </button>
                </li>
                <li>
                    {#if status == "running"}
                        <button
                            class="flex duration-100 hover:scale-110" 
                            on:click={ () => serviceAction('stop') }
                        >
                            <Fa icon={ faPowerOff } size="1.5rem" />
                            <p class="px-2">Stop</p>
                        </button>
                    {/if}
                    {#if status == "stopped"}
                        <button
                            class="flex duration-100 hover:scale-110" 
                            on:click={ () => serviceAction('start') }
                        >
                            <Fa icon={ faPowerOff } size="1.5rem" />
                            <p class="px-2">Start</p>
                        </button>
                    {/if}
                </li>
            </ul>
        {:else}
            <Fa 
                icon={ faSpinner } size="1.5rem" 
                spin
            />
        {/if}
    </div>
</div>

<style>
    .card > .title {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition-duration: 100ms;
    }

    .card:hover > .title {
        transform: translate(-50%, 50%);
        top: 0;
    }

    .card > ul {
        transition-duration: 100ms;
        opacity: 0;
    }

    .card:hover > ul {
        opacity: 1;
    }

    .card > .menu-icon {
        opacity: 0;
        transition: 100ms;
    }

    .card:hover > .menu-icon {
        opacity: 1;
    }

    .card > ul > li {
        display: flex;
    }

    .card > ul > li > p {
        padding: 0 0.5rem;
    }

    .menu {
        width: 100%;
        height: 0;
        overflow: hidden;
        transition-duration: 200ms;
    }
</style>