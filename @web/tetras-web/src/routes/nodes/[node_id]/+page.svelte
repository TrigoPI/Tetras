<script lang="ts">
	import { faDroplet, faLocationDot, faTemperature0 } from "@fortawesome/free-solid-svg-icons";
	import { faEye } from "@fortawesome/free-regular-svg-icons";
    import BatteryChart from "./battery-chart.svelte";
	import SensorData from "./sensor-data.svelte";
	import TemperatureChart from "./temperature-chart.svelte";

    export let data: Record<string, string>;
</script>

<div class="p-4">
    <h1 class="text-5xl text-center py-4">{ data.node_id }</h1>
    <div class="sensor-data">
        <SensorData 
            icon={ faLocationDot }
            title="Latitude"
            value="43.1473934"
        />
        <SensorData 
            icon={ faLocationDot }
            title="Longitude"
            value="1.3597004"
        />
        <SensorData 
            icon={ faTemperature0 }
            title="Temperature"
            value="10°c"
        />
        <SensorData 
            icon={ faDroplet }
            title="Humidity"
            value="20%"
        />
        <SensorData 
            icon={ faEye }
            title="Last Seen"
            value="25/11/2023"
        />
    </div>
    <div class="mt-12">
        <center>
            <BatteryChart />
        </center>
    </div>
    <div class="flex flex-col gap-10 justify-center mt-4 lg:flex-row lg:flex-wrap">
        <TemperatureChart 
            title="Temperature (°C)"
            x="Time"
            y="°C"
        />
        <TemperatureChart 
            title="Humidity (%)"
            x="Time"
            y="%"
        />
    </div>
</div>

<style>
    .sensor-data {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    }
</style>