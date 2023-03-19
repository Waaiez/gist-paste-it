<script lang="ts">
	import languages from './languages.json';
</script>

<!-- TODO: migrate to a list modal -->
<label class="label">
	<select name="languageSelection" id="languageSelection" class="select rounded-lg">
		{#each languages as language}
			<option value={language.name} disabled={language.disabled} class="rounded-lg"
				>{language.name}</option
			>
		{/each}
	</select>
</label>
