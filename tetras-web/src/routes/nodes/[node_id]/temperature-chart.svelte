<script lang="ts">
	import { LineChart, ScaleTypes, type LineChartOptions, type ChartTabularData } from "@carbon/charts-svelte";

    export let title: string;
    export let x: string;
    export let y: string;

    const data: ChartTabularData = [
        {
            group: 'Dataset 2',
            date: new Date(2019, 0, 2),
            value: 0,
        },
        {
            group: 'Dataset 2',
            date: new Date(2019, 0, 6),
            value: 10,
        },
        {
            group: 'Dataset 2',
            date: new Date(2019, 0, 8),
            value: 5,
        },
        {
            group: 'Dataset 2',
            date: new Date(2019, 0, 15),
            value: 8,
        },
        {
            group: 'Dataset 2',
            date: new Date(2019, 0, 19),
            value: 11,
        },
    ];

    const options: LineChartOptions = {
        title: title,
        axes: {
            bottom: {
                title: x,
                mapsTo: 'date',
                scaleType: ScaleTypes.TIME
            },
            left: {
                title: y,
                mapsTo: 'value',
                scaleType: ScaleTypes.LINEAR
            }
        },
        tooltip: {
          enabled: false  
        },
        toolbar: {
            enabled: false
        },
        legend: { 
            enabled: false
        },
        curve: 'curveMonotoneX',
        height: "15rem",
    }
</script>

<div class="shadow-md rounded-sm px-2 py-4 flex items-center sm:w-[600px]">
    <LineChart 
        options={ options }
        data={ data }
    />
</div>