import Vibrant from 'node-vibrant';

export async function extract(url:string) {
    const palette = await Vibrant.from(url).getPalette();

    return palette;
}