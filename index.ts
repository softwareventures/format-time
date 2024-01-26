/** @file Convert @softwareventures/time to a string in a variety of formats. */

import type {Time} from "@softwareventures/time";

/** A function that formats a {@link Time} or part of a {@link Time} as a
 * string. */
export type TimeFormatter = (time: Time) => string;
