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

<div class="h-screen">
    <form
        class="h-full flex flex-col gap-4 items-center justify-center" 
        on:submit|preventDefault={ (e) => onSubmit(e) }
    >
        <div class="w-96">
            <InputText 
                title="API Core"
                name="api-core"
                placeholder="localhost:8080"
            />
        </div>
        
        <div class="flex gap-8">
            <Button type="submit">
                <span>Save</span>
            </Button>
    
            <a href="/dashboard">
                <Button>
                    <span>Dashboard</span>
                </Button>
            </a>
        </div>
    </form>
</div>