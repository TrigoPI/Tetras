<script lang="ts">
	import { browser } from "$app/environment";
	import { onDestroy, onMount, tick } from "svelte";
	import type { Map } from "leaflet";

    let mapHeight: number = 0;
    let map: Map | undefined = undefined;
    let container: HTMLDivElement | undefined = undefined;
    let mapElement: HTMLDivElement | undefined = undefined;

    const onResize = (): void => {
        if (!container) return;
        if (!mapElement) return;
        if (!map) return;

        const offsetY: number = container.offsetTop;
        const windowH: number = window.innerHeight;
        
        mapHeight = windowH - offsetY;
    }

    const resizeMap = async (): Promise<void> => {
        if (!map) return;
        onResize();
        await tick();
        map.invalidateSize();
    }

    onMount(async () => {
        if (!browser) return;
        if (!container) return;
        if (!mapElement) return;

        const leaflet = await import('leaflet');
        const attribution: string = `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`
        const maxZoom: number = 17;

        map = leaflet.map(mapElement).setView([43.1473934, 1.3597004], 7);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);
        leaflet.tileLayer('http://a.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution, maxZoom }).addTo(map);	
        
        await resizeMap();
    });

    onDestroy(async () => {
        if (!map) return;
        map.remove();
    })
</script>

<svelte:window on:resize={ resizeMap } />

<div style={ `height: ${mapHeight}px` } bind:this={ container }> 
    <div class="w-full h-full" bind:this={ mapElement } />
</div>