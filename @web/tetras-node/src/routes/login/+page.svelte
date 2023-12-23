<script lang="ts">
	import Button from "@components/button.svelte";
	import InputText from "@components/input-text.svelte";
	import Routes from "@utils/routes";

    const onSubmit = (e: SubmitEvent) => {
        if (!e.target) return;
        const formData: FormData = new FormData(<HTMLFormElement>e.target);
        Routes.API_CORE_URL = `http://${formData.get('api-core')}`;
    } 
</script>

<div>
    <form on:submit|preventDefault={ (e) => onSubmit(e) }>
        <InputText 
            title="API Core"
            name="api-core"
            placeholder="localhost:8080"
        />
        
        <Button 
            type="submit"
            title="Save"
        />

        <a href="/dashboard">
            <Button 
                title="Dashboard"
            />
        </a>
    </form>
</div>