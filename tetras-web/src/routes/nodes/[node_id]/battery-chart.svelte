<script lang="ts">
    import '@carbon/charts-svelte/styles.css'
    import { DonutChart, type ChartTabularData, type DonutChartOptions } from '@carbon/charts-svelte'

    const battery: number = 87;
    const empty: number = 100 - battery;

    const data: ChartTabularData = [
        {
            group: 'Battery',
            value: battery
        },
        {
            group: 'Empty',
            value: empty,
        },
    ];

    const options: DonutChartOptions = {
        resizable: false,
        donut: {
            center: {
                label: "Battery",
                number: battery,
                numberFormatter: (n: number) => `${n}%`
            },
        },
        color: {
            scale: {
                "Battery" : "#2ecc71",
                "Empty"   : "#34495e",
            }
        },
        pie: {
            labels: {
                enabled: false
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
        height: "20rem",
        width: "20rem"
    };
</script>

<div class="p-4 w-fit">
    <DonutChart 
        data={data} 
        options={options}
    />
</div>