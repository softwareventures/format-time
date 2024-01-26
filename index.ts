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

/** Rounds the seconds portion of the specified {@link Time} down and
 * formats the result as a 2-digit numeric string. */
export function floorSeconds2(time: {readonly seconds: number}): string {
    return String(Math.floor(time.seconds)).padStart(2, "0");
}

/** Rounds the seconds portion of the specified {@link Time} down to the
 * next lower millisecond, and formats the result as a 2.3-digit string. */
export function secondsMs(time: {readonly seconds: number}): string {
    const s = String(Math.floor(time.seconds * 1000)).padStart(5, "0");
    return `${s.substring(0, 2)}.${s.substring(2)}`;
}

/** Options for formatting a {@link Time} in ISO 8601 format.
 *
 * @see iso8601 */
export interface Iso8601Options {
    /** Whether to use the "basic" or "extended" ISO 8601 format. In the
     * "basic" format, colons are omitted.
     *
     * @default "extended" */
    readonly format?: "basic" | "extended" | undefined;

    /** Whether to round the time down before formatting.
     *
     * If set to `"none"`, no rounding is performed.
     *
     * If set to `"seconds"`, the time is rounded down to the next lower
     * second.
     *
     * If set to `"ms"`, the time is rounded down to the next lower
     * millisecond.
     *
     * @default "none" */
    readonly round?: "none" | "seconds" | "ms" | undefined;

    /** Whether to include the optional leading `"T"`.
     *
     * @default true */
    readonly leadingT?: boolean | undefined;
}

/** Returns a {@link TimeFormatter} that formats the specified {@link Time} as
 * ISO 8601, with the specified options.
 *
 * By default, the {@link Time} is formatted in the "extended" ISO 8601 format,
 * with the leading `"T"`, and without rounding, for example
 * `"T11:57:23.723615"`.
 *
 * If the `format` option is set to `"basic"`, then the colons are omitted,
 * for example `"T115723.723615"`.
 *
 * If the `round` option is set to `"seconds"`, then the time is rounded down
 * to the next lower second, for example `"T11:57:23"`.
 *
 * If the `round` option is set to `"ms"`, then the time is rounded down to
 * the next lower millisecond, for example `"T11:57:23.723"`.
 *
 * If the `leadingT` option is set to `false`, then the leading `"T"` is
 * omitted, for example `"11:57:23.363215"`.*/
export function iso8601(options: Iso8601Options = {}): TimeFormatter {
    const leading = options.leadingT ?? true ? () => "T" : () => "";
    const separator = {
        basic: () => "",
        extended: () => ":"
    }[options.format ?? "extended"];
    const seconds = {
        none: seconds2,
        seconds: floorSeconds2,
        ms: secondsMs
    }[options.round ?? "none"];
    return timeTemplate`${leading}${hours2}${separator}${minutes2}${separator}${seconds}`;
}

/** Formats the specified {@link Time} as ISO 8601 extended, rounded down to
 * the next lower second, and with no leading `"T"`.
 *
 * This format is intended to be reasonable for display to humans. */
export const humanIso8601 = iso8601({round: "seconds", leadingT: false});
