<script lang="ts">
	export let action: svelte.JSX.MouseEventHandler<HTMLButtonElement>;
	export let text: string;
	export let type: string;
</script>

<button on:click={action} class={type}>
	{text}
</button>

<style lang="scss">
	button {
		cursor: pointer;

		font-size: 14px;
		line-height: 1;
		border-radius: 500px;
		padding: 16px 48px 18px;
		transition-property: background-color, border-color, color, box-shadow, filter;
		transition-duration: 0.3s;
		border-width: 0;
		letter-spacing: 2px;
		min-width: 160px;
		text-transform: uppercase;
		white-space: normal;
		font-weight: 700;

        margin: 1rem;

		&.primary {
			color: #fff;
			background-color: #1db954;

			&:hover,
			&:focus {
				color: #fff;
				background-color: #1ed760;
			}

			&:active {
				background-color: #1aa34a;
				box-shadow: none;
			}
		}

		&.cancel {
			color: #616467;
			background-color: none;
		}
	}
</style>
