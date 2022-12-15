<script lang="ts">
	import languages from './languages.json';
</script>

<select name="languageSelection" id="languageSelection" class="rounded-lg">
	{#each languages as language}
		<option value={language.name} disabled={language.disabled} class="rounded-lg"
			>{language.name}</option
		>
	{/each}
</select>
