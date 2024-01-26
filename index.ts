/** @file Convert @softwareventures/time to a string in a variety of formats. */

import type {Time} from "@softwareventures/time";
import {concatMap} from "@softwareventures/array";

/** A function that formats a {@link Time} or part of a {@link Time} as a
 * string. */
export type TimeFormatter = (time: Time) => string;

/** Constructs a function that formats a {@link Time} using the specified
 * template.
 *
 * This function is intended to be used as a template literal tag function.
 *
 * The template may contain placeholders which will be called as functions
 * with the specified {@link Time} as their argument.
 *
 * @example
 * const formatShort12Hour = dateTemplate`${hours12}:${minutes2} ${amPm}`;
 * const text = formatShort12Hour(time); */
export function timeTemplate(
    texts: TemplateStringsArray,
    ...formatters: readonly TimeFormatter[]
): TimeFormatter {
    return time => concatMap(texts, (text, i) => [text, formatters[i]?.(time)]).join("");
}

/** Formats the hours portion of the specified {@link Time} as a 24-hour
 * numeric string. */
export function hours(time: {readonly hours: number}): string {
    return String(time.hours);
}

/** Formats the hours portion of the specified {@link Time} as a 2-digit
 * 24-hour numeric string. */
export function hours2(time: {readonly hours: number}): string {
    return String(time.hours).padStart(2, "0");
}

/** Formats the hours portion of the specified {@link Time} as a 12-hour
 * numeric string. */
export function hours12(time: {readonly hours: number}): string {
    return String((12 + (time.hours % 12)) % 12);
}

/** Formats the hours portion of the specified {@link Time} as a 2-digit
 * 12-hour numeric string. */
export function hours122(time: {readonly hours: number}): string {
    return String((12 + (time.hours % 12)) % 12).padStart(2, "0");
}

export type AmPm = "AM" | "PM";

/** Returns `"AM"` or `"PM"` depending on the hour of the specified
 * {@link Time}. */
export function amPm(time: {readonly hours: number}): AmPm {
    return time.hours < 12 ? "AM" : "PM";
}

/** Formats the minutes portion of the specified {@link Time} as a
 * numeric string. */
export function minutes(time: {readonly minutes: number}): string {
    return String(time.minutes);
}

/** Formats the minutes portion of the specified {@link Time} as a
 * 2-digit numeric string. */
export function minutes2(time: {readonly minutes: number}): string {
    return String(time.minutes).padStart(2, "0");
}

/** Formats the seconds portion of the specified {@link Time} as a
 * numeric string.
 *
 * Note that fractional seconds will not be rounded, so this might produce
 * a result similar to `"2.234"` */
export function seconds(time: {readonly seconds: number}): string {
    return String(time.seconds);
}

/** Formats the seconds portion of the specified {@link Time} as a numeric
 * string. If necessary, adds a leading zero to the whole part of the seconds
 * to ensure the whole part is at least two digits.
 *
 * Note that fractional seconds will not be rounded, so this might produce
 * a result similar to `"02.234"`. */
export function seconds2(time: {readonly seconds: number}): string {
    return String(time.seconds).replace(/^\d+/u, s => s.padStart(2, "0"));
}

/** Rounds the seconds portion of the specified {@link Time} down and
 * formats the result as a numeric string. */
export function floorSeconds(time: {readonly seconds: number}): string {
    return String(Math.floor(time.seconds));
}
