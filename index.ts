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
