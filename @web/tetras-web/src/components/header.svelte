<script lang="ts">
    import Fa from "svelte-fa"
    import { faBars } from "@fortawesome/free-solid-svg-icons";

    import HeaderItem from "./header-item.svelte"

    let menuOpen: boolean = false;
</script>

<header class="w-screen py-5 shadow-sm border-b sticky top-0 bg-white z-[500]">
    <nav class="px-3 flex flex-row items-center h-full justify-between relative">
        <div class="font-bold text-2xl order-1">
            <h1>Tetras</h1>
        </div>
        <div class="order-3 sm:hidden">
            <button on:click={ () => menuOpen = !menuOpen }>
                <Fa icon={ faBars } size="lg"/>
            </button>
        </div>
        <div class="{menuOpen? "block" : "hidden"} absolute left-full -translate-x-full translate-y-1/2 py-4 sm:block sm:order-2 sm:flex-1 sm:relative sm:translate-x-0 sm:translate-y-0 sm:left-auto sm:py-0">
            <ul class="text-lg font-semibold py-3 px-6 flex flex-col w-full justify-center rounded-sm gap-3 shadow-sm bg-white sm:flex-row sm:shadow-none sm:p-0 sm:gap-12">
                <HeaderItem 
                    text="Home"
                    href="/home"
                    onClick={ () => menuOpen = false }
                />
                <HeaderItem 
                    text="Nodes"
                    href="/nodes"
                    onClick={ () => menuOpen = false }
                />
                <HeaderItem 
                    text="Gateway"
                    href="/home"
                    onClick={ () => menuOpen = false }
                />
                <HeaderItem 
                    text="Detection"
                    href="/home"
                    onClick={ () => menuOpen = false }
                />
                <HeaderItem 
                    text="Images"
                    href="/home"
                    onClick={ () => menuOpen = false }
                />
            </ul>
        </div>
    </nav>
</header>