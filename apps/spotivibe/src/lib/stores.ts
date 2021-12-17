import { writable } from "svelte/store";
import {Current} from "./Current";

export const current = writable(new Current());

export const isLoggedIn = writable(false);